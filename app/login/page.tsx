"use client";
import AuthLayout from "../components/AuthLayout";
import AuthForm from "../components/AuthForm";

const Login: React.FC = () => (
  <AuthLayout
    title="Welcome back"
    subtitle="Sign in to your shared itineraries"
    leftFooterText="Plan trips together, in real time. Add stops, explore the world as a group."
  >
    <AuthForm mode="login" />
  </AuthLayout>
);

export default Login;