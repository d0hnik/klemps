use std::{
    io::{Read, Write},
    net::{SocketAddr, TcpListener, TcpStream},
    time::Duration,
};

use klemps_api::{app::create_server, config::Config};

// Use a new connection each time so requests can reach different server workers.
fn request(address: SocketAddr, method: &str, path: &str, origin: Option<&str>) -> String {
    let mut stream = TcpStream::connect_timeout(&address, Duration::from_secs(5)).unwrap();
    stream
        .set_read_timeout(Some(Duration::from_secs(5)))
        .unwrap();
    stream
        .set_write_timeout(Some(Duration::from_secs(5)))
        .unwrap();
    write!(
        stream,
        "{method} {path} HTTP/1.1\r\nHost: {address}\r\nConnection: close\r\n"
    )
    .unwrap();
    if let Some(origin) = origin {
        write!(stream, "Origin: {origin}\r\n").unwrap();
    }
    stream.write_all(b"\r\n").unwrap();

    let mut response = String::new();
    stream.read_to_string(&mut response).unwrap();
    response
}

#[actix_web::test]
async fn production_server_shares_limits_and_applies_security_middleware() {
    let config =
        Config::parse_all("127.0.0.1", "3000", "http://localhost:5173", "1", "60").unwrap();
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    let address = listener.local_addr().unwrap();
    let server = create_server(listener, config).unwrap();
    let handle = server.handle();
    let task = actix_web::rt::spawn(server);

    let requests = actix_web::rt::task::spawn_blocking(move || {
        let first = request(address, "GET", "/api/v1/missing", None);
        assert!(first.starts_with("HTTP/1.1 404"), "{first}");
        for _ in 0..12 {
            let response = request(address, "GET", "/api/v1/missing", None);
            assert!(response.starts_with("HTTP/1.1 429"), "{response}");
            assert!(response.contains("RATE_LIMITED"));
        }

        let health = request(address, "GET", "/api/health", Some("http://localhost:5173"));
        assert!(health.starts_with("HTTP/1.1 200"), "{health}");
        assert!(health.contains("access-control-allow-origin: http://localhost:5173"));

        let forbidden_origin =
            request(address, "GET", "/api/health", Some("https://other.example"));
        assert!(
            forbidden_origin.starts_with("HTTP/1.1 400"),
            "{forbidden_origin}"
        );
        assert!(forbidden_origin.contains("INVALID_REQUEST"));

        let wrong_method = request(address, "POST", "/api/health", None);
        assert!(wrong_method.starts_with("HTTP/1.1 405"), "{wrong_method}");
        assert!(wrong_method.contains("METHOD_NOT_ALLOWED"));
    })
    .await;

    handle.stop(false).await;
    task.await.unwrap().unwrap();
    requests.unwrap();
}
