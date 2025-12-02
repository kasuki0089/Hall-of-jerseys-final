import MainTemplate from "@/templates/MainTemplate/Index";
import CookieExample from "@/components/CookieExample";

export default function TesteCookiesPage() {
  return (
    <MainTemplate>
      <div className="min-h-screen bg-gray-50 py-12">
        <CookieExample />
      </div>
    </MainTemplate>
  );
}