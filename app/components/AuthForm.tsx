"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button, Form, Input } from "antd";

interface AuthFormProps {
  readonly mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [form] = Form.useForm();
  const router = useRouter();
  const apiService = useApi();
  const isRegister = mode === "register";
  
  const {
    set: setToken
  } = useLocalStorage<string>("token", "");
  const {
    set: setUserId
  } = useLocalStorage<string>("userId", "");
  const {
    set: setUser
  } = useLocalStorage<User | null>("user", null);
  
  const handleLogin = async (values: { username: string; password: string; password_confirm?: string }) => {
    try {
      const response = await apiService.post<User>("/users", values);
      if (response.token) setToken(response.token);
      if (response.id) setUserId(String(response.id));
      if (response) setUser(response);
      router.push("/trips");
    } catch (error) {
      if (error instanceof Error) alert(`Something went wrong:\n${error.message}`);
    }
  };

  return (
    <Form
      form={form}
      name={mode}
      size="large"
      onFinish={handleLogin}
      layout="vertical"
    >
      <Form.Item
        style={{ marginTop: 40 }}
        name="username"
        label="USERNAME"
        rules={[{ required: true, message: "Please input your username" }]}
      >
        <Input placeholder="Enter username" />
      </Form.Item>

      <Form.Item
        style={{ marginTop: 0 }}
        name="password"
        label="PASSWORD"
        rules={[{ required: true, message: "Please input your password" }]}
      >
        <Input.Password placeholder="Enter password" />
      </Form.Item>

      {isRegister && (
        <Form.Item
          style={{ marginTop: 0 }}
          name="password_confirm"
          label="CONFIRM PASSWORD"
          rules={[{ required: true, message: "Please confirm your password" }]}
        >
          <Input.Password placeholder="Re-enter password" />
        </Form.Item>
      )}

      <Form.Item style={{ marginTop: 50, marginBottom: 10 }}>
        <Button
          type="primary"
          htmlType="submit"
          className="login-button"
        >
          {isRegister ? "Create Account" : "Sign in"}
        </Button>
      </Form.Item>

      <p style={{ color: "#4A4340", fontWeight: 300, fontSize: 15 }}>
        {isRegister ? (
          <>Already have an account? <a href="/login" style={{ color: "#C2603A", fontWeight: 300 }}>Sign in</a></>
        ) : (
          <>Don't have an account? <a href="/register" style={{ color: "#C2603A", fontWeight: 300 }}>Create one</a></>
        )}
      </p>
    </Form>
  );
}
