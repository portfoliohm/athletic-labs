"use client";

export default function TestNavPage() {
  return (
    <div className="min-h-screen bg-red-100">
      {/* Always visible sidebar for testing */}
      <div className="flex w-64 flex-col fixed inset-y-0 border-r bg-blue-500 z-40">
        <div className="p-4 text-white">
          <h1 className="text-xl font-bold">TEST SIDEBAR</h1>
          <div className="mt-4 space-y-2">
            <div className="p-2 bg-blue-600 rounded">Dashboard</div>
            <div className="p-2 bg-blue-600 rounded">New Order</div>
            <div className="p-2 bg-blue-600 rounded">Menu Templates</div>
            <div className="p-2 bg-blue-600 rounded">Orders</div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="pl-64">
        <div className="p-6">
          <h1 className="text-3xl font-bold">TEST PAGE</h1>
          <p>If you can see this page with a blue sidebar on the left, then the basic layout works.</p>
          <p>This means the issue is with authentication or the AuthenticatedLayout component.</p>
        </div>
      </div>
    </div>
  );
}