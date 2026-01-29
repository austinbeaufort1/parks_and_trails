import { useState } from "react";
import { supabase } from "../connection/supabase";
import { FormTitle, FormInput, FormError, FormButton } from "./ui/Forms";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <>
      <FormTitle>Create Account</FormTitle>

      <FormInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <FormInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <FormError>{error}</FormError>}

      <FormButton onClick={handleSignup} loading={loading}>
        {loading ? "Signing up..." : "Sign up"}
      </FormButton>
    </>
  );
}
