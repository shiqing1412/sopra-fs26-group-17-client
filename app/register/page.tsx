"use client";
import AuthLayout from "../components/AuthLayout";
import AuthForm from "../components/AuthForm";

const Register: React.FC = () => (
  <AuthLayout
    title="Create account"
    subtitle="Join WanderSync to start planning"
    leftFooterText="Plan trips together, in real time. Your group is waiting."
  >
    <AuthForm mode="register" />
  </AuthLayout>
);

export default Register;