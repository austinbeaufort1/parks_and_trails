import styled from "styled-components";
import { Button } from "../components/ui/Buttons";
import { Title } from "../components/ui/Titles";
import { Subtitle } from "../components/ui/Subtitles";
import {
  FeatureCard,
  FeatureDescription,
  FeatureTitle,
} from "../components/ui/FeatureCard";
import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import "./Home.css";
import AuthScreen from "../components/AuthScreen";

interface HomeProps {
  setTab: (key: string) => void;
}

const Home: React.FC<HomeProps> = ({ setTab }) => {
  const [showAuth, setShowAuth] = useState(false);

  const { user, logout } = useAuth();

  // ✅ Close modal automatically when user logs in
  useEffect(() => {
    if (user) setShowAuth(false);
  }, [user]);

  return (
    <div className="home-page">
      {/* ---------- Hero Section ---------- */}
      <div className="home-hero">
        <div className="home-hero-overlay">
          <Title>Parks & Trails of One Skinny Dude</Title>
          <Subtitle>
            Explore detailed trail maps, slope data, difficulty ratings, tree
            coverage, and more. Perfect for planning your next adventure!
          </Subtitle>
          <div className="home-buttons">
            <Button onClick={() => setTab("map")}>Go to Map</Button>
            {!user ? (
              <Button onClick={() => setShowAuth(true)}>
                Login to track hikes
              </Button>
            ) : (
              <Button
                onClick={async () => {
                  await logout();
                }}
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>

      <FeaturesGrid>
        <FeatureCard>
          <FeatureTitle>Interactive Maps</FeatureTitle>
          <FeatureDescription>
            Zoom, pan, and select trails with color-coded slope segments and
            trailhead markers.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureTitle>Trail Difficulty</FeatureTitle>
          <FeatureDescription>
            Quickly see average angles, maximum steepness, tree coverage, and
            distance.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureTitle>Adventure Planning</FeatureTitle>
          <FeatureDescription>
            Get descriptions, park info, and even links to trail videos.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>

      <AuthScreen open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
};

const FeaturesGrid = styled.section`
  display: grid;
  gap: 1rem;
  margin-top: 2rem;

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
