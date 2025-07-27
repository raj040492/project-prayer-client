import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Home = () => {
  const navigate = useNavigate();

  const banners = [
    {
      id: 1,
      title: "Sacred Services",
      description:
        "Experience divine services and spiritual guidance from the comfort of your home",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
      color: "#8B4513",
    },
    {
      id: 2,
      title: "Premium Quality",
      description:
        "Crystal clear streaming with immersive audio for a truly spiritual experience",
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=400&fit=crop",
      color: "#DAA520",
    },
    {
      id: 3,
      title: "Secure & Private",
      description:
        "Protected access to sacred content with secure authentication",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
      color: "#2E8B57",
    },
  ];

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "80px" }}>
        {/* Hero Section */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #8B4513 0%, #DAA520 50%, #2E8B57 100%)",
            color: "white",
            padding: "80px 20px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.1,
              zIndex: 1,
            }}
          />
          <div style={{ position: "relative", zIndex: 2 }}>
            <h1
              style={{
                fontSize: "3.5rem",
                marginBottom: "20px",
                fontWeight: "300",
              }}
            >
              Divine Services Live
            </h1>
            <p
              style={{
                fontSize: "1.3rem",
                marginBottom: "10px",
                opacity: 0.95,
                fontWeight: "300",
              }}
            >
              Connect with your faith through our premium pay-per-view streaming
              platform
            </p>
            <p
              style={{ fontSize: "1.1rem", marginBottom: "40px", opacity: 0.8 }}
            >
              Experience sacred ceremonies and spiritual guidance from anywhere
              in the world
            </p>
            <button
              onClick={() => navigate("/video")}
              style={{
                padding: "18px 40px",
                fontSize: "1.2rem",
                backgroundColor: "rgba(255,255,255,0.95)",
                color: "#8B4513",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                transition: "all 0.3s",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
              }}
            >
              Join Sacred Service
            </button>
          </div>
        </div>

        {/* Banners Section */}
        <div
          style={{ padding: "60px 20px", maxWidth: "1200px", margin: "0 auto" }}
        >
          <h2
            style={{ textAlign: "center", marginBottom: "40px", color: "#333" }}
          >
            Sacred Experience Features
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "30px",
            }}
          >
            {banners.map((banner) => (
              <div
                key={banner.id}
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 35px rgba(0,0,0,0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(0,0,0,0.1)";
                }}
              >
                <div
                  style={{
                    height: "200px",
                    backgroundImage: `url(${banner.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(45deg, ${banner.color}22, transparent)`,
                    }}
                  />
                </div>
                <div style={{ padding: "25px" }}>
                  <h3
                    style={{
                      margin: "0 0 15px 0",
                      color: "#333",
                      fontSize: "1.4rem",
                    }}
                  >
                    {banner.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      color: "#666",
                      lineHeight: "1.6",
                      fontSize: "1rem",
                    }}
                  >
                    {banner.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            padding: "80px 20px",
            textAlign: "center",
            borderTop: "1px solid #dee2e6",
          }}
        >
          <h2
            style={{
              color: "#8B4513",
              marginBottom: "20px",
              fontSize: "2.5rem",
              fontWeight: "300",
            }}
          >
            Begin Your Spiritual Journey
          </h2>
          <p
            style={{ color: "#666", marginBottom: "15px", fontSize: "1.2rem" }}
          >
            Join our community of faithful followers experiencing divine
            services
          </p>
          <p style={{ color: "#888", marginBottom: "40px", fontSize: "1rem" }}>
            Secure, private, and accessible from anywhere in the world
          </p>
          <button
            onClick={() => navigate("/video")}
            style={{
              padding: "18px 45px",
              fontSize: "1.2rem",
              backgroundColor: "#8B4513",
              color: "white",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 6px 20px rgba(139,69,19,0.3)",
              transition: "all 0.3s",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#A0522D";
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 8px 25px rgba(139,69,19,0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#8B4513";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(139,69,19,0.3)";
            }}
          >
            Access Sacred Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
