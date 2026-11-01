use std::{env, fs, path::PathBuf, process::Command};

fn main() {
    // Regenerate when a shared Rust type is added, removed, or changed.
    println!("cargo:rerun-if-changed=src/dto");
    println!("cargo:rerun-if-changed=src/domain");
    println!("cargo:rerun-if-env-changed=KLEMPS_FRONTEND_DIR");
    println!("cargo:rerun-if-env-changed=KLEMPS_SKIP_TS_GENERATION");

    // Useful when deploying the API independently of the frontend.
    if env::var("KLEMPS_SKIP_TS_GENERATION").as_deref() == Ok("1") {
        return;
    }

    let backend_root = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());
    let frontend = env::var_os("KLEMPS_FRONTEND_DIR")
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from("../client"));

    // Interpret relative paths from the backend Cargo.toml directory.
    let frontend = if frontend.is_absolute() {
        frontend
    } else {
        backend_root.join(frontend)
    };

    if !frontend.join("src").is_dir() {
        panic!(
            "Frontend src directory does not exist: {}. Set KLEMPS_FRONTEND_DIR or KLEMPS_SKIP_TS_GENERATION=1",
            frontend.join("src").display()
        );
    }

    let generated_dir = frontend.join("src/api/generated");
    fs::create_dir_all(&generated_dir).expect("Cannot create frontend generated-types directory");
    let output = generated_dir.join("types.ts");

    // Typeshare scans source files for #[typeshare] structs and enums.
    let status = Command::new("typeshare")
        .arg(backend_root.join("src"))
        .arg("--lang=typescript")
        .arg("--output-file")
        .arg(&output)
        .status()
        .expect("`typeshare` not installed. Run: cargo install typeshare-cli --locked");

    assert!(status.success(), "TypeScript generation failed");
    println!("cargo:warning=Rust API types generated at {}", output.display());
}
