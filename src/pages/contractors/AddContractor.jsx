import { useState } from "react";

export default function AddContractor() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    address: "",
    registrationNo: "",
    renewalDate: "",
    email: "",
    contractorType: "",
    panVatNo: "",
    companyName: "",
    companyPhone: "",
    companyEmail: "",
    ward: "",
    municipality: "",
    district: "",
    suchidarta: "",
  });

  const [files, setFiles] = useState({
    registrationCertificate: null,
    panVatCertificate: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (name, file) => {
    setFiles({ ...files, [name]: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (files.registrationCertificate) {
      data.append("registrationCertificate", files.registrationCertificate);
    }

    if (files.panVatCertificate) {
      data.append("panVatCertificate", files.panVatCertificate);
    }

    console.log("Submitting:", formData, files);
    alert("Contractor Added Successfully (Temporary)");
  };

  return (
    <div className="bg-white rounded-2xl shadow">

      {/* HEADER */}
      <div className="bg-[#1F4E79] text-white text-center py-3 rounded-t-2xl text-lg font-semibold">
        Contractor Details
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">

        {/* NAME SECTION */}
        <div className="grid md:grid-cols-3 gap-6">
          <Input label="First Name" name="firstName" onChange={handleChange} />
          <Input label="Middle Name" name="middleName" onChange={handleChange} />
          <Input label="Last Name" name="lastName" onChange={handleChange} />
        </div>

        {/* BASIC DETAILS */}
        <div className="grid md:grid-cols-3 gap-6">
          <Input label="Address" name="address" onChange={handleChange} />
          <Input label="Registration No." name="registrationNo" onChange={handleChange} />
          <Input type="date" label="Latest Renewal Date" name="renewalDate" onChange={handleChange} />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Input type="email" label="Email" name="email" onChange={handleChange} />
          <Input label="Contractor Type" name="contractorType" onChange={handleChange} />
          <Input label="PAN/VAT No." name="panVatNo" onChange={handleChange} />
        </div>

        <hr />

        {/* COMPANY SECTION */}
        <div className="text-sm font-semibold text-gray-600">
          If Firm/Company Type
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Input label="Company Name" name="companyName" onChange={handleChange} />
          <Input label="Company Phone" name="companyPhone" onChange={handleChange} />
          <Input label="Company Email" name="companyEmail" onChange={handleChange} />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Input label="Ward" name="ward" onChange={handleChange} />
          <Input label="Municipality" name="municipality" onChange={handleChange} />
          <Input label="District" name="district" onChange={handleChange} />
        </div>

        <hr />

        {/* FILE UPLOAD SECTION */}
        <div className="grid md:grid-cols-2 gap-8">

          <UploadBox
            label="Registration Certificate"
            name="registrationCertificate"
            file={files.registrationCertificate}
            onFileChange={handleFileChange}
          />

          <div className="space-y-2">
            <label className="text-sm text-gray-600">Suchidarta</label>
            <select
              name="suchidarta"
              value={formData.suchidarta}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#1F4E79]"
            >
              <option value="">Select</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>

          <UploadBox
            label="PAN/VAT Certificate"
            name="panVatCertificate"
            file={files.panVatCertificate}
            onFileChange={handleFileChange}
          />

        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#1F4E79] hover:bg-[#163a5a] text-white px-8 py-2 rounded-md transition"
          >
            Add
          </button>
        </div>

      </form>
    </div>
  );
}


/* ---------------- Reusable Components ---------------- */

function Input({ label, name, type = "text", onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type={type}
        name={name}
        onChange={onChange}
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#1F4E79]"
      />
    </div>
  );
}

function UploadBox({ label, name, file, onFileChange }) {
  const handleFile = (selectedFile) => {
    if (selectedFile) {
      onFileChange(name, selectedFile);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-600">{label}</label>

      <label className="border-2 border-dashed rounded-xl h-32 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition">
        <input
          type="file"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {file ? (
          <span className="text-sm text-gray-700 text-center px-2">
            {file.name}
          </span>
        ) : (
          <>
            <span className="text-2xl">+</span>
            <span className="text-xs">Click to upload</span>
          </>
        )}
      </label>
    </div>
  );
}
