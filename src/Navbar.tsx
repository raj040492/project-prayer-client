import { useAuth } from "react-oidc-context";
import { Link } from "react-router-dom";

const Navbar = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <nav
        style={{
          backgroundColor: "#f8f9fa",
          padding: "1rem 2rem",
          borderBottom: "1px solid #dee2e6",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <Link
          to="/"
          style={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            color: "#333",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          Live Streaming Platform
        </Link>
        <div style={{ color: "#666" }}>Loading...</div>
      </nav>
    );
  }

  return (
    <nav
      style={{
        backgroundColor: "#f8f9fa",
        padding: "1rem 2rem",
        borderBottom: "1px solid #dee2e6",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <Link
        to="/"
        style={{
          fontWeight: "bold",
          fontSize: "1.2rem",
          color: "#333",
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        Live Streaming Platform
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {auth.isAuthenticated ? (
          <>
            <span style={{ color: "#666", fontSize: "0.9rem" }}>
              Welcome, {auth.user?.profile.email}
            </span>
            <button
              onClick={() => auth.removeUser()}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={() => auth.signinRedirect()}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "500",
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
