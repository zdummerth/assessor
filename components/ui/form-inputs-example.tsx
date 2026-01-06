// components/ui/form-inputs-example.tsx
"use client";

import { useState } from "react";
import { FormInput } from "./form-input";
import { DatePicker } from "./date-picker";
import { ComboboxLookup } from "./combobox-lookup";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

export function FormInputsExample() {
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: undefined as Date | undefined,
    hireDate: undefined as Date | undefined,
    employeeId: "",
    neighborhood: "",
    status: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email format";
    if (!formData.employeeId)
      newErrors.employeeId = "Please select an employee";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Form submitted:", formData);
    alert("Form submitted successfully! Check console for data.");
  };

  return (
    <div className="space-y-8 p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Form Input Components
        </h1>
        <p className="text-muted-foreground mt-2">
          Examples of reusable form input components with validation and SWR
          data fetching
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complete Form Example</CardTitle>
          <CardDescription>
            All form components with validation and error handling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Text Inputs */}
              <FormInput
                label="First Name"
                placeholder="John"
                required
                value={formData.firstName}
                onChange={(e) => {
                  setFormData({ ...formData, firstName: e.target.value });
                  setErrors({ ...errors, firstName: "" });
                }}
                error={errors.firstName}
              />

              <FormInput
                label="Last Name"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />

              <FormInput
                label="Email"
                type="email"
                placeholder="john.doe@example.com"
                required
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setErrors({ ...errors, email: "" });
                }}
                error={errors.email}
                helperText="We'll never share your email with anyone else."
              />

              <FormInput
                label="Phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />

              {/* Date Pickers */}
              <DatePicker
                label="Birth Date"
                value={formData.birthDate}
                onChange={(date) =>
                  setFormData({ ...formData, birthDate: date })
                }
                placeholder="Select birth date"
                toDate={new Date()} // Can't be in the future
                helperText="Must be 18 years or older"
              />

              <DatePicker
                label="Hire Date"
                value={formData.hireDate}
                onChange={(date) =>
                  setFormData({ ...formData, hireDate: date })
                }
                placeholder="Select hire date"
              />

              {/* Combobox Lookups with SWR */}
              <ComboboxLookup
                label="Assigned Employee"
                required
                endpoint="/api/employees"
                placeholder="Select an employee"
                value={formData.employeeId}
                onChange={(value) => {
                  setFormData({ ...formData, employeeId: value || "" });
                  setErrors({ ...errors, employeeId: "" });
                }}
                error={errors.employeeId}
                searchPlaceholder="Search employees…"
                allowClear
              />

              <ComboboxLookup
                label="Neighborhood"
                endpoint="/neighborhoods/api"
                params={{ page_size: 300 }}
                transformData={(data) =>
                  data.map((n: any) => ({
                    value: n.id,
                    label: `${n.name} (${n.neighborhood})`,
                  }))
                }
                value={formData.neighborhood}
                onChange={(value) =>
                  setFormData({ ...formData, neighborhood: value || "" })
                }
                placeholder="Select neighborhood"
                searchPlaceholder="Search neighborhoods…"
              />

              <ComboboxLookup
                label="Status"
                endpoint="/api/employees"
                params={{ field: "status" }}
                value={formData.status}
                onChange={(value) =>
                  setFormData({ ...formData, status: value || "" })
                }
                placeholder="Select status"
                groupBy={(option) => option.label.charAt(0).toUpperCase()}
                helperText="Group by first letter"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit">Submit Form</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    birthDate: undefined,
                    hireDate: undefined,
                    employeeId: "",
                    neighborhood: "",
                    status: "",
                  });
                  setErrors({});
                }}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Individual Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Component Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* FormInput Examples */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Text Input Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Basic Input" placeholder="Enter text" />
              <FormInput
                label="With Error"
                placeholder="Enter text"
                error="This field is invalid"
              />
              <FormInput
                label="Disabled"
                placeholder="Can't edit"
                disabled
                value="Disabled value"
              />
              <FormInput
                label="With Helper Text"
                placeholder="Enter text"
                helperText="This is helpful information"
              />
            </div>
          </div>

          {/* DatePicker Examples */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Date Picker Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DatePicker label="Basic Date" placeholder="Pick a date" />
              <DatePicker
                label="With Error"
                placeholder="Pick a date"
                error="Date is required"
              />
              <DatePicker
                label="Future Dates Only"
                placeholder="Pick a future date"
                fromDate={new Date()}
                helperText="Only future dates allowed"
              />
              <DatePicker
                label="Past Dates Only"
                placeholder="Pick a past date"
                toDate={new Date()}
                helperText="Only past dates allowed"
              />
            </div>
          </div>

          {/* ComboboxLookup Examples */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Combobox Lookup Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ComboboxLookup
                label="Basic Lookup"
                endpoint="/api/employees"
                placeholder="Select option"
              />
              <ComboboxLookup
                label="With Params"
                endpoint="/api/employees"
                params={{ role: "appraiser" }}
                placeholder="Select appraiser"
              />
              <ComboboxLookup
                label="Custom Transform"
                endpoint="/devnet-reviews/api"
                params={{ page_size: 50 }}
                transformData={(data) =>
                  data.map((r: any) => ({
                    value: r.id,
                    label: `${r.due_date} - ${r.kind}`,
                  }))
                }
                placeholder="Select review"
              />
              <ComboboxLookup
                label="Auto-Refresh"
                endpoint="/api/employees"
                refreshInterval={30000}
                placeholder="Refreshes every 30s"
                helperText="Data refreshes automatically"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Data Display */}
      <Card>
        <CardHeader>
          <CardTitle>Current Form State</CardTitle>
          <CardDescription>Live preview of form data</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-4 rounded-md overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
