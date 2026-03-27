"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useRouter } from "next/navigation"; // use NextJS router for navigation
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button, Form, Input } from "antd";
// Optionally, you can import a CSS module or file for additional styling:
// import styles from "@/styles/page.module.css";

interface RegisterFields {
  username: string;
  password: string;
  password_confirm: string;
}

const Register: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();
  // useLocalStorage hook example use
  // The hook returns an object with the value and two functions
  // Simply choose what you need from the hook:
  const {
    // value: token, // is commented out because we do not need the token value
    set: setToken, // we need this method to set the value of the token to the one we receive from the POST request to the backend server API
    // clear: clearToken, // is commented out because we do not need to clear the token when logging in
  } = useLocalStorage<string>("token", ""); // note that the key we are selecting is "token" and the default value we are setting is an empty string
  // if you want to pick a different token, i.e "usertoken", the line above would look as follows: } = useLocalStorage<string>("usertoken", "");

  const {
    set: setUserId,
  } = useLocalStorage<string>("userId", "");

const handleLogin = async (values: RegisterFields) => {
    try {
      const response = await apiService.post<User>("/users", values);
    if (response.token) {
      setToken(response.token);
    }
    if (response.id) {
      setUserId(String(response.id));
    }
    router.push("/trips");
    
    } catch (error) {
        if (error instanceof Error) {
            alert(`Something went wrong during the login:\n${error.message}`);
        } else {
            console.error("An unknown error occurred during login.");
        }
        }
    };

    return (
      <div className="login-container">
      <div className="login-left"> {/* left side of the screen */}
        <div style={{ display: "flex" }}>
          <h1 style={{ marginTop: 70, marginLeft: 60, fontFamily: "'DM Serif Display', serif"}}>Wander</h1>
          <h1 style={{ marginTop: 70, fontFamily: "'DM Serif Display', serif", color: "#da8360"}}>Sync</h1>
        </div>
        <p style={{ marginTop: "auto", marginLeft: 60, marginBottom: 100, color: "#8A7A6A", fontWeight: 300, lineHeight: 1.6, fontSize: 16 }}>Plan trips together, in real time.</p>
      </div>
      <div className="login-right"> {/* right side of the screen */}
        <Form
          form={form}
          name="login"
          size="large"
          variant="outlined"
          onFinish={handleLogin}
          layout="vertical"
        >
          <h1 style={{ fontFamily: "'DM Serif Display', serif",color: "#1A1612" }}>Welcome back</h1>
          <h4 style={{ color: "#4A4340", fontWeight: 300, lineHeight: 1.6 }}>Sign in to your shared itineraries</h4>
            <Form.Item style={{ marginTop: 50 }}
                name="username"
                label="USERNAME"
                rules={[{ required: true, message: "Please input your username" }]}
            >
                <Input placeholder="Enter username" />
            </Form.Item>
            <Form.Item style={{ marginTop: 40 }}
                name="password"
                label="PASSWORD"
                rules={[{ required: true, message: "Please input your password"}]}
            >
                <Input.Password placeholder="Enter password" />
            </Form.Item>
            <Form.Item style={{ marginTop: 40 }}
                name="password_confirm"
                label="CONFIRM PASSWORD"
                rules={[{ required: true, message: "Please confirm your password"}]}
            >
                <Input.Password placeholder="Re-enter password" />
            </Form.Item>
            <Form.Item style={{ marginTop: 50, marginBottom: 10 }}>
                <Button type="primary" htmlType="submit" className="register-button">
                Create Account
                </Button>
            </Form.Item>
            <p style={{ color: "#4A4340",  fontWeight: 300, fontSize: 15 }}>Already have an account?
                <a href="/login" style={{ color: "#C2603A",  fontWeight: 300 }}>Sign in</a>
            </p>
            </Form>
        </div>
        </div>
    );
    };

export default Register;
