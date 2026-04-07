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

  const handleLogin = async (values: { username: string; password: string; passwordConfirm?: string }) => {
    try{
      const response = await apiService.post<User>("/login", values);  
      if (response.token) setToken(response.token);
      if (response.id) setUserId(String(response.id));
      if (response) setUser(response);
      const joinRedirect = localStorage.getItem("joinRedirect");
      if (joinRedirect) {
        localStorage.removeItem("joinRedirect");
        router.push(joinRedirect);
      } else {
        router.push("/trips");
      }
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (message.includes("The username is not correct!")) {
          form.setFields([{ name: "username", errors: ["Username does not exist. Please enter a valid username."] }]);
        } else if (message.includes("The password is incorrect!")) {
          form.setFields([{ name: "password", errors: ["Password is incorrect. Please try again."] }]);
        } else {
          alert(`Something went wrong:\n${message}`);
        }
      }
  };

  const handleRegister = async (values: { username: string; password: string; passwordConfirm?: string }) => {
    // placeholder as backend is missing the check for now: password and passwordConfirm must match
    // if (values.password !== values.passwordConfirm) {
    //  form.setFields([{ name: "passwordConfirm", errors: ["Passwords do not match."] }]);
    //  return;
    // }
    // placeholder end

    try{
      const response = await apiService.post<User>("/users", values);  
      if (!response.token) {
        alert("Registration failed. Please try again.");
        return;
      }

      setToken(response.token);
      setUserId(String(response.id));
      setUser(response);
      router.push("/trips");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);  
      if (message.includes("Username already taken. Please choose a different one.")) {
        form.setFields([{ name: "username", errors: ["Username already taken. Please choose a different one."] }]);
      } else if(message.includes("Username is required.")) {
        form.setFields([{ name: "username", errors: ["Username is required. Please input a username."]}])
      } else if(message.includes("Password is required.")) {
        form.setFields([{ name: "password", errors: ["Password is required. Please input a password."]}])
      } else if(message.includes("Password must be at least 6 characters.")) {
        form.setFields([{ name: "password", errors: ["Password must be at least 6 characters."] }]);
      } else if(message.includes("Passwords do not match.")) {
        form.setFields([{ name: "passwordConfirm", errors: ["Passwords do not match."] }]);
      } else {
        alert(`Something went wrong:\n${message}`);
      }
    }
  };

  return (
    <Form
      form={form}
      name={mode}
      size="large"
      onFinish={isRegister ? handleRegister : handleLogin}
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
          name="passwordConfirm"
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
          <>Already have an account? <a href="/login" style={{ color: "#c0392b", fontWeight: 300 }}>Sign in</a></>
        ) : (
          <>Don&apos;t have an account? <a href="/register" style={{ color: "#c0392b", fontWeight: 300 }}>Create one</a></>
        )}
      </p>
    </Form>
  );
}
