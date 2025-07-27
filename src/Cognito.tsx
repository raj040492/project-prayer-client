import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";

interface UserProfile {
  sub: string | undefined;
  email: string | undefined;
  cognitoUsername: string | unknown;
}

const Login = () => {
  const auth = useAuth();

  const sendUserProfileToDynamoDB = async (profileData: UserProfile) => {
    console.log("Attempting to send user profile to DynamoDB:", profileData);
    // Replace with your actual API Gateway endpoint URL for the USER PROFILE MANAGER Lambda
    const apiUrl =
      "https://bhusw33vp1.execute-api.ap-south-1.amazonaws.com/default/UserProfileManager";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        console.log("User profile sent to DynamoDB successfully!");
      } else {
        console.error(
          "Failed to send user profile:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error sending user profile:", error);
    }
  };

  useEffect(() => {
    if (auth?.isAuthenticated) {
      sendUserProfileToDynamoDB({
        sub: auth?.user?.profile?.sub,
        email: auth?.user?.profile?.email,
        cognitoUsername: auth?.user?.profile?.["cognito:username"],
      });
    }
  }, [auth]);

  // const signOutRedirect = () => {
  //   const clientId = "1stgpdrmh74n2empv5il3gvcbt";
  //   const logoutUri = "https://www.example.com/signout";
  //   const cognitoDomain =
  //     "https://ap-south-1l7jvp7aez.auth.ap-south-1.amazoncognito.com";
  //   window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
  //     logoutUri
  //   )}`;
  // };

  if (auth.isLoading) {
    return (
      <div>
        <Navbar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
            textAlign: "center",
            padding: "20px",
            marginTop: "80px",
          }}
        >
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div>
        <Navbar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
            textAlign: "center",
            padding: "20px",
            marginTop: "80px",
          }}
        >
          <div>Encountering error... {auth.error.message}</div>
        </div>
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/video" replace />;
  }

  return (
    <div>
      <Navbar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          textAlign: "center",
          padding: "20px",
          marginTop: "80px",
        }}
      >
        <div>
          <h2 style={{ marginBottom: "20px", color: "#333" }}>
            Login Required
          </h2>
          <p style={{ marginBottom: "30px", color: "#666", fontSize: "16px" }}>
            You need to be logged in to access the video page. Please sign in to
            continue.
          </p>
          <div
            style={{ display: "flex", gap: "15px", justifyContent: "center" }}
          >
            <button
              onClick={() => auth.signinRedirect()}
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#0056b3";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#007bff";
              }}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
