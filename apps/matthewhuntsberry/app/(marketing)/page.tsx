import Link from "next/link";
import { Timestamp } from "../../components/Timestamp"; // ✅ Using your Timestamp component

export default async function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <h1>Hello World</h1>
      </div>
    </div>
  );
}
