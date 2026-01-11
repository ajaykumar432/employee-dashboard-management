

import React, { useEffect, useMemo, useState } from "react";

/* =============================== CONSTANTS & DEFAULT DATA ================================ */
const STORAGE_KEY = "employees";
const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI0MCIgcj0iMTgiIGZpbGw9IiNlNWU3ZWIiLz48cGF0aCBkPSJNMTUgODVjMC0xOSAyOC0yNSAzNS0yNXMzNSA2IDM1IDI1IiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
];

const DEFAULT_EMPLOYEES = [
  { id: 1768144144335, name: "Ajay Kumar", gender: "Male", dob: "1995-06-12", state: "Gujarat", active: true, image: DEFAULT_AVATAR },
  { id: 1768144144336, name: "Neha Sharma", gender: "Female", dob: "1998-02-20", state: "Maharashtra", active: true, image: DEFAULT_AVATAR },
    { id: 1768144144337, name: "Rohit Verma", gender: "Male", dob: "1992-09-15", state: "Delhi", active: false, image: DEFAULT_AVATAR },
];

/* =============================== COMPONENT ================================ */
const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [empModal, setEmpModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "", gender: "", dob: "", state: "", active: true, image: DEFAULT_AVATAR,
  });
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  /* =============================== INIT FROM LOCALSTORAGE ================================ */
  useEffect(() => {
    setTimeout(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EMPLOYEES));
        setEmployees(DEFAULT_EMPLOYEES);
      } else {
        setEmployees(JSON.parse(stored));
      }
      setLoading(false);
    }, 300);
  }, []);

  const persist = (data) => {
    setEmployees(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  /* =============================== FORM HANDLERS ================================ */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setForm({ name: "", gender: "", dob: "", state: "", active: true, image: DEFAULT_AVATAR });
    setEditingId(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.dob) newErrors.dob = "Date of birth is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    if (editingId) {
      const updated = employees.map((emp) =>
        emp.id === editingId ? { ...form, id: editingId } : emp
      );
      persist(updated);
    } else {
      persist([...employees, { ...form, id: Date.now() }]);
    }
    setEmpModal(false);
    resetForm();
    setErrors({});
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setForm(emp);
    setEmpModal(true);
  };

  const handleDelete = () => {
    persist(employees.filter((e) => e.id !== deleteModal.id));
    setDeleteModal(null);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Employee List</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #1f2937; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #4f46e5; color: white; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .status-active { color: green; font-weight: bold; }
            .status-inactive { color: red; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Employee List Report</h1>
          <p><strong>Total Employees:</strong> ${filteredEmployees.length}</p>
          <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Date of Birth</th>
                <th>State</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredEmployees.map(emp => `
                <tr>
                  <td>${emp.id}</td>
                  <td>${emp.name}</td>
                  <td>${emp.gender}</td>
                  <td>${emp.dob}</td>
                  <td>${emp.state}</td>
                  <td class="${emp.active ? 'status-active' : 'status-inactive'}">
                    ${emp.active ? 'Active' : 'Inactive'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  /* =============================== FILTERING ================================ */
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchName = emp.name.toLowerCase().includes(search.toLowerCase());
      const matchGender = genderFilter ? emp.gender === genderFilter : true;
      const matchStatus = statusFilter === "" ? true : statusFilter === "active" ? emp.active : !emp.active;
      return matchName && matchGender && matchStatus;
    });
  }, [employees, search, genderFilter, statusFilter]);

  /* =============================== COUNTS ================================ */
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.active).length;
  const inActiveEmployees = employees.filter((e) => !e.active).length;

  const handleToggleStatus = (id) => {
  const updatedEmployees = employees.map(emp =>
    emp.id === id ? { ...emp, active: !emp.active } : emp
  );
  persist(updatedEmployees);
};

  
//   console.log(activeEmployees, inActiveEmployees)
  /* =============================== LOADING STATE ================================ */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  /* =============================== RENDER ================================ */
  return (
    <div className="min-h-screen shadow-sm rounded-xl p-4">
      <div className="max-w-auto mx-auto">
        {/* HEADER */}
        <div className="mb-2">
          <h1 className="text-lg font-semibold text-gray-800 mb-4">Employee Management System</h1>
        </div>

        {/* SUMMARY CARDS */}
      <div className="w-full mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

  {/* STATS CARD */}
  <div className="bg-white rounded-xl shadow-lg p-4 transform w-full lg:w-auto">
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
      <div>
        <p className="text-gray-600 text-md font-medium">
          Total Employees : <span>{totalEmployees}</span>
        </p>
      </div>

      <div>
        <p className="text-gray-600 text-md font-medium">
          Active Employees : <span>{activeEmployees}</span>
        </p>
      </div>

      <div>
        <p className="text-gray-600 text-md font-medium">
          InActive Employees : <span>{inActiveEmployees}</span>
        </p>
      </div>
    </div>
  </div>

  {/* ACTION BUTTONS */}
  <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center justify-start sm:justify-between w-full lg:w-auto">
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto">
      <button
        onClick={() => setEmpModal(true)}
        className="w-full sm:w-auto bg-gradient-to-r cursor-pointer from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Employee
      </button>

      <button
        onClick={handlePrint}
        className="w-full sm:w-auto bg-gradient-to-r cursor-pointer from-gray-700 to-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-800 hover:to-black transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 0 00-2 2v4h10z" />
        </svg>
        Print List
      </button>
    </div>
  </div>

</div>


        {/* CONTROLS */}
       <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
  {/* SEARCH & FILTER */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
    
    {/* Search */}
    <div className="relative w-full md:max-w-sm">
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border-2 border-gray-300 px-4 py-3 pl-10 rounded-lg focus:outline-none focus:border-indigo-500"
      />
      <svg
        className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>

    {/* Filters */}
    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
      <select
        value={genderFilter}
        onChange={(e) => setGenderFilter(e.target.value)}
        className="w-full cursor-pointer sm:w-auto border-2 border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-indigo-500"
      >
        <option value="">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full cursor-pointer sm:w-auto border-2 border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-indigo-500"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

  </div>
</div>


        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Gender</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">DOB</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">State</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-indigo-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-800">{emp.id}</td>
                    <td className="px-6 py-4">
                      <img src={emp.image} alt={emp.name} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200" />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{emp.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{emp.gender}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{emp.dob}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{emp.state}</td>
                    {/* <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${emp.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {emp.active ? "Active" : "Inactive"}
                      </span>
                    </td> */}

                    <td className="px-6 py-4">
  <div className="flex items-center gap-3">
    {/* Toggle */}
    <button
      onClick={() => handleToggleStatus(emp.id)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 cursor-pointer ${
        emp.active ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
          emp.active ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>

    {/* Label */}
    <span
      className={`text-sm font-semibold ${
        emp.active ? "text-green-700" : "text-red-600"
      }`}
    >
      {emp.active ? "Active" : "Inactive"}
    </span>
  </div>
</td>

                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button onClick={() => handleEdit(emp)} className="text-indigo-600 cursor-pointer hover:text-indigo-800 font-medium transition-colors">
                          Edit
                        </button>
                        <button onClick={() => setDeleteModal(emp)} className="text-red-600 cursor-pointer hover:text-red-800 font-medium transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredEmployees.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No employees found</p>
              </div>
            )}
          </div>
        </div>

        {/* ADD / EDIT MODAL */}
        {empModal && (
          <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[80vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold">{editingId ? "Edit Employee" : "Add New Employee"}</h2>
                <button onClick={() => { setEmpModal(false); resetForm(); }} className="text-white hover:text-gray-200 cursor-pointer transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex justify-center mb-2">
                  <div className="relative">
                    <img src={form.image} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200" />
                    <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-indigo-500"
                    placeholder="Enter full name"
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                  {errors.dob && <p className="text-red-600 text-sm mt-1">{errors.dob}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="active"
                    checked={form.active}
                    onChange={handleChange}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <label className="ml-3 text-sm font-semibold text-gray-700">Active Employee</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => { setEmpModal(false); resetForm(); }}
                    className="flex-1 cursor-pointer border-2 border-gray-300 px-6 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r cursor-pointer from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-xl"
                  >
                    {editingId ? "Update Employee" : "Add Employee"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete <span className="font-semibold">{deleteModal.name}</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteModal(null)}
                    className="flex-1 cursor-pointer border-2 border-gray-300 px-6 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 cursor-pointer bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md hover:shadow-xl"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )}

  export default EmployeeDashboard;

