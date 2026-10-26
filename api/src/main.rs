use klemps_api::{
    app,
    config::Config,
    services::{Services, health_service::HealthService},
    state::AppState,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = Config::from_env()?;
    tracing_subscriber::fmt()
        .json()
        .with_env_filter(config.log_filter.clone())
        .try_init()
        .map_err(|_| "Could not initialize logging")?;
    let listener = tokio::net::TcpListener::bind(config.bind_address).await?;
    tracing::info!(address = %listener.local_addr()?, "API listening");
    let services = Services::new(HealthService);
    let state = AppState::new(services);
    axum::serve(listener, app(&config, state))
        .with_graceful_shutdown(shutdown_signal())
        .await?;
    Ok(())
}

async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("install Ctrl+C handler")
    };
    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("install SIGTERM handler")
            .recv()
            .await;
    };
    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();
    tokio::select! { _ = ctrl_c => {}, _ = terminate => {} }
    tracing::info!("API shutting down");
}
