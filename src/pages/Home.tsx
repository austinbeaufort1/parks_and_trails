import styled from "styled-components";
import { Button, CloudButton } from "../components/ui/Buttons";
import { Title } from "../components/ui/Titles";
import { Subtitle } from "../components/ui/Subtitles";
import {
  FeatureCard,
  FeatureDescription,
  FeatureTitle,
} from "../components/ui/FeatureCard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import "./Home.css";
import AuthScreen from "../components/AuthScreen";
import { Clouds } from "../components/ui/Clouds";

interface HomeProps {
  setTab: (key: string) => void;
}

const Home: React.FC<HomeProps> = ({ setTab }) => {
  const [showAuth, setShowAuth] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Detect iPhone/iOS
  const isiPhone = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    if (user) setShowAuth(false);
  }, [user]);

  return (
    <div
      style={{ backgroundImage: `url("/badges/logo1.jpeg")` }}
      className="home-page"
    >
      {/* ---------- Hero Section ---------- */}
      {isiPhone ? (
        <div className="home-hero-iphone">
          <div className="home-hero-overlay">
            {" "}
            {/* keep overlay! */}
            <h1 className="title-main">Trail Depth</h1>
            <div className="home-buttons">
              <CloudButton onClick={() => navigate("/trails")}>
                Explore
              </CloudButton>
              {!user ? (
                <CloudButton
                  style={{ marginBottom: "150px" }}
                  onClick={() => setShowAuth(true)}
                >
                  Login to Track
                </CloudButton>
              ) : (
                <CloudButton style={{ marginBottom: "150px" }} onClick={logout}>
                  Logout
                </CloudButton>
              )}
            </div>
            <Subtitle className="iphone-subtitle">
              Walk, run, or hike curated trails your way. Track your progress,
              log your experience, and explore beyond the ordinary. Trail Depth
              is about more than finishing paths — it’s about how you choose to
              move. Every step counts.
            </Subtitle>
          </div>
        </div>
      ) : (
        // default desktop/Android hero stays the same
        <div className="home-hero">
          <div className="home-hero-overlay">
            <h1 style={{ fontSize: "3rem" }} className="title-main">
              Trail Depth
            </h1>
            <div className="home-buttons">
              <CloudButton onClick={() => navigate("/trails")}>
                Explore
              </CloudButton>
              {!user ? (
                <CloudButton onClick={() => setShowAuth(true)}>
                  Login to Track
                </CloudButton>
              ) : (
                <CloudButton onClick={logout}>Logout</CloudButton>
              )}
            </div>
            <Subtitle
              style={{
                textShadow: "0 10px 10px rgba(0, 0, 0, 1)",
                fontWeight: "bold",
                background: "rgba(0, 0, 0, 0.5)",
                borderRadius: "10px",
                marginTop: "5%",
                padding: "1rem",
              }}
            >
              Walk, run, or hike curated trails your way. Track your progress,
              log your experience, and explore beyond the ordinary. Trail Depth
              is about more than finishing paths — it’s about how you choose to
              move. Every step counts.
            </Subtitle>
          </div>
        </div>
      )}

      {/* ---------- Feature Cards ---------- */}
      <FeaturesGrid>
        <FeatureCard>
          <FeatureTitle>Trail Completion</FeatureTitle>
          <FeatureDescription>
            Mark trails as complete and record what you did — walking, running,
            or hiking — every adventure counts.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureTitle>Detailed Slope Maps</FeatureTitle>
          <FeatureDescription>
            See slope and angle data every 25ft along each trail to plan your
            pace and effort.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureTitle>Track Your Stats</FeatureTitle>
          <FeatureDescription>
            Log distance, time, packs carried, weighted vests, and movement
            challenges to see your progress.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureTitle>Wildlife & Observations</FeatureTitle>
          <FeatureDescription>
            Record wildlife seen, terrain conditions, time of day, and seasonal
            changes on your hikes.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureTitle>Creative Challenges</FeatureTitle>
          <FeatureDescription>
            Optional fun: juggle, ride a unicycle, play disc golf, or test
            balance with awkward loads. Go beyond the ordinary.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureTitle>Adventure Extras</FeatureTitle>
          <FeatureDescription>
            Track stunts, unusual gaits, extreme weather, or “after dark” hikes.
            Unlock badges for bold moves and creativity.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>

      {/* ---------- Auth Modal ---------- */}
      <AuthScreen open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
};

// Styled grid for feature cards
const FeaturesGrid = styled.section`
  display: grid;
  gap: 1rem;
  margin-top: 0.5rem;
  width: 90%;
  margin-left: auto;
  margin-right: auto;

  /* Tablet */
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Desktop */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export default Home;
