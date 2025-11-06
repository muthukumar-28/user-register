import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Form.css";

function Form() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    full_name: "",
    dob: "",
    address: "",
    country: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};

    if (!form.username) e.username = "Username is required";
    if (!form.full_name) e.full_name = "Full name is required";
    if (!form.dob) e.dob = "Date of birth is required";
    if (!form.address) e.address = "Address is required";
    if (!form.country) e.country = "Country is required";
    if (!form.email) e.email = "Email is required";
    if (!form.phone) e.phone = "Phone number is required";
    if (!form.password) e.password = "Password is required";

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      e.email = "Invalid email format";
    }

    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      e.phone = "Phone number must be 10 digits";
    }

    const p = form.password || "";
    const passwordErrors = [];
    if (p) {
      if (p.length < 8) passwordErrors.push("• At least 8 characters long");
      if (!/[A-Z]/.test(p))
        passwordErrors.push("• At least one uppercase letter");
      if (!/\d/.test(p)) passwordErrors.push("• At least one number");
      if (!/[!@#$%^&*]/.test(p))
        passwordErrors.push("• At least one special character (!@#$%^&*)");
    }

    if (passwordErrors.length > 0) {
      e.password = passwordErrors.join("\n");
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      const newErrors = { ...prev };

      if (value.trim() !== "" && newErrors[name]) {
        delete newErrors[name];
      }

      if (name === "password") {
        const p = value;
        const passwordErrors = [];
        if (p.length < 8) passwordErrors.push("• At least 8 characters long");
        if (!/[A-Z]/.test(p))
          passwordErrors.push("• At least one uppercase letter");
        if (!/\d/.test(p)) passwordErrors.push("• At least one number");
        if (!/[!@#$%^&*]/.test(p))
          passwordErrors.push("• At least one special character (!@#$%^&*)");

        if (passwordErrors.length > 0)
          newErrors.password = passwordErrors.join("\n");
        else delete newErrors.password;
      }

      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post("http://localhost:5000/api/users", form);
      toast.success("User registered successfully");
      setForm({
        username: "",
        password: "",
        full_name: "",
        dob: "",
        address: "",
        country: "",
        email: "",
        phone: "",
      });
      setErrors({});
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error(err.response.data?.error || "Duplicate entry");
      } else if (err.response?.status === 400) {
        toast.error(err.response.data?.error || "Validation error");
      } else {
        toast.error("Server error");
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>User Registration</h2>

        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
        />
        {errors.username && <span>{errors.username}</span>}

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {errors.password && (
          <span style={{ whiteSpace: "pre-line" }}>{errors.password}</span>
        )}

        <input
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          placeholder="Full Name"
        />
        {errors.full_name && <span>{errors.full_name}</span>}

        <input
          name="dob"
          type="date"
          value={form.dob}
          onChange={handleChange}
        />
        {errors.dob && <span>{errors.dob}</span>}

        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
        />
        {errors.address && <span>{errors.address}</span>}

        <select name="country" value={form.country} onChange={handleChange}>
          <option value="">Select Country</option>
          <option value="India">India</option>
          <option value="Thailand">Thailand</option>
          <option value="Singapore">Singapore</option>
          <option value="Malaysia">Malaysia</option>
          <option value="UAE">UAE</option>
        </select>
        {errors.country && <span>{errors.country}</span>}

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <span>{errors.email}</span>}

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
        />
        {errors.phone && <span>{errors.phone}</span>}

        <button type="submit">SIGN UP</button>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        draggable
        closeButton
        icon={false}
      />
    </div>
  );
}

export default Form;
