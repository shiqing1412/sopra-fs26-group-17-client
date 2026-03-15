"use client";
import { useRouter } from "next/navigation";
import { Button } from "antd";

export default function Home() {
  const router = useRouter();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>Group 17 - WanderSync</h1>
      <Button
        type="primary"
        variant="solid"
        size="large"
        style={{ marginTop: "2rem" }}
        onClick={() => router.push("/login")}
      >
        Go to login
      </Button>
    </div>
  );
}
