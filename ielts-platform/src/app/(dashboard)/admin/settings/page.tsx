"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardTitle, Button, Input, Tabs } from "@/components/ui";
import { Save, Upload, Globe, Mail, Phone, Palette } from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General" },
    { id: "branding", label: "Branding" },
    { id: "contact", label: "Contact" },
    { id: "seo", label: "SEO" },
    { id: "social", label: "Social" },
  ];

  return (
    <DashboardLayout title="Site Settings" subtitle="Manage your platform configuration and branding.">
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="underline" className="mb-8" />

      {activeTab === "general" && (
        <Card className="p-6 max-w-2xl">
          <CardTitle className="mb-6">General Settings</CardTitle>
          <div className="space-y-5">
            <Input label="Site Name" defaultValue="Pro English BD" />
            <Input label="Tagline" defaultValue="Bangladesh's #1 IELTS Mock Test Platform" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-navy-900 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">P</span>
                </div>
                <Button variant="outline" size="sm" leftIcon={<Upload className="w-4 h-4" />}>
                  Upload Logo
                </Button>
              </div>
            </div>
            <Button leftIcon={<Save className="w-4 h-4" />}>Save Changes</Button>
          </div>
        </Card>
      )}

      {activeTab === "branding" && (
        <Card className="p-6 max-w-2xl">
          <CardTitle className="mb-6">Brand Colors</CardTitle>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Primary Color (Red)</label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-red-500 rounded-lg border" />
                <Input defaultValue="#e53e3e" className="w-32" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Secondary Color (Navy Blue)</label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-navy-900 rounded-lg border" />
                <Input defaultValue="#102a43" className="w-32" />
              </div>
            </div>
            <Button leftIcon={<Save className="w-4 h-4" />}>Save Colors</Button>
          </div>
        </Card>
      )}

      {activeTab === "contact" && (
        <Card className="p-6 max-w-2xl">
          <CardTitle className="mb-6">Contact Information</CardTitle>
          <div className="space-y-5">
            <Input label="Email" defaultValue="info@proenglishbd.com" leftIcon={<Mail className="w-4 h-4" />} />
            <Input label="Phone" defaultValue="+880 1XXX-XXXXXX" leftIcon={<Phone className="w-4 h-4" />} />
            <Input label="WhatsApp" defaultValue="+880 1XXX-XXXXXX" />
            <Input label="Address" defaultValue="Dhaka, Bangladesh" />
            <Button leftIcon={<Save className="w-4 h-4" />}>Save Contact</Button>
          </div>
        </Card>
      )}

      {activeTab === "seo" && (
        <Card className="p-6 max-w-2xl">
          <CardTitle className="mb-6">SEO Settings</CardTitle>
          <div className="space-y-5">
            <Input label="SEO Title" defaultValue="Pro English BD - IELTS Computer-Based Mock Test Platform" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Description</label>
              <textarea
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200 min-h-[100px]"
                defaultValue="Bangladesh's premier IELTS computer-based mock test platform. Practice Listening, Reading, Writing, and Speaking."
              />
            </div>
            <Input label="Keywords" defaultValue="IELTS, mock test, Bangladesh, computer-based, practice" />
            <Button leftIcon={<Save className="w-4 h-4" />}>Save SEO</Button>
          </div>
        </Card>
      )}

      {activeTab === "social" && (
        <Card className="p-6 max-w-2xl">
          <CardTitle className="mb-6">Social Links</CardTitle>
          <div className="space-y-5">
            <Input label="Facebook" placeholder="https://facebook.com/proenglishbd" />
            <Input label="YouTube" placeholder="https://youtube.com/@proenglishbd" />
            <Input label="Instagram" placeholder="https://instagram.com/proenglishbd" />
            <Input label="Twitter/X" placeholder="https://x.com/proenglishbd" />
            <Button leftIcon={<Save className="w-4 h-4" />}>Save Links</Button>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}
