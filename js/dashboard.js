// ==============================
// Dashboard JavaScript
// ==============================
window.onload = loadDashboard;
document.getElementById("loggedInUser").innerText =
    localStorage.getItem("empCode");

async function loadDashboard() {

    try {
        const token = localStorage.getItem("token");

        const response = await fetch("https://localhost:7104/api/Dashboard", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        document.getElementById("totalEmployees").innerText = data.totalEmployees;

        document.getElementById("totalDepartments").innerText = data.totalDepartments;

        document.getElementById("attendancePercent").innerText = data.presentToday;

        document.getElementById("pendingLeaves").innerText = data.pendingLeaves;

    }
    catch {

        alert("Unable to load dashboard data.");

    }

}
async function loadEmployees() {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch("https://localhost:7104/api/Employee", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const employees = await response.json();

        let html = `
        <h2>Employee Management</h2>
        <br>
        <button class="add-btn" id="addEmployeeBtn">
    + Add Employee
</button>

        <table>

            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
        `;

        employees.forEach(emp => {

            html += `
            <tr>

                <td>${emp.empID}</td>
                <td>${emp.empName}</td>
                <td>${emp.department}</td>
                <td>${emp.isActive ? "Active" : "Inactive"}</td>

                <td>
                    <button class="edit-btn"
onclick="editEmployee(${emp.empID})">
    Edit
</button>
                    <button class="delete-btn" onclick="deleteEmployee(${emp.empID})">
    Delete
</button>
                </td>

            </tr>
            `;

        });

        html += "</table>";

        content.innerHTML = html;
        document
            .getElementById("addEmployeeBtn")
            .addEventListener("click", showAddEmployeeForm);

    }
    catch {

        alert("Unable to load employees.");

    }

}
function showAddEmployeeForm() {

    content.innerHTML = `

    <h2>Add Employee</h2>

    <input type="text" id="empName" placeholder="Employee Name">

<select id="deptID">
    <option value="">Select Department</option>
</select>

    <select id="status">
        <option value="true">Active</option>
        <option value="false">Inactive</option>
    </select>

    <br><br>

    <button class="add-btn" onclick="saveEmployee()">
        Save Employee
    </button>

    <button onclick="loadEmployees()">
        Cancel
    </button>

    `;
    loadDepartments();
}

async function loadDepartments() {

    try {


        const token = localStorage.getItem("token");

        const response = await fetch("https://localhost:7104/api/Department", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const departments = await response.json();

        const select = document.getElementById("deptID");

        select.innerHTML = '<option value="">Select Department</option>';

        departments.forEach(dept => {

            let option = document.createElement("option");

            option.value = dept.deptID;

            option.textContent = dept.deptName;

            select.appendChild(option);

        });

    }
    catch (err) {

        console.log(err);

    }
}
async function saveEmployee() {

    const employee = {

        empName: document.getElementById("empName").value,

        deptID: Number(document.getElementById("deptID").value),
        isActive: document.getElementById("status").value === "true"

    };

    const token = localStorage.getItem("token");

    const response = await fetch("https://localhost:7104/api/Employee", {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },

        body: JSON.stringify(employee)

    });

    if (response.ok) {

        alert("Employee Added Successfully");

        loadEmployees();

    }
    else {

        alert("Unable to Add Employee");

    }

}
async function deleteEmployee(id) {

    if (!confirm("Are you sure you want to delete this employee?")) {
        return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch(
        `https://localhost:7104/api/Employee/${id}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (response.ok) {

        alert("Employee Deleted Successfully");

        loadEmployees();

    }
    else {

        alert("Unable to Delete Employee");

    }

}
async function editEmployee(id) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `https://localhost:7104/api/Employee/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const emp = await response.json();

    content.innerHTML = `

    <h2>Edit Employee</h2>

    <input
        type="text"
        id="empName"
        value="${emp.empName}">

    <select id="deptID"></select>


    <select id="status">

        <option value="true">
            Active
        </option>

        <option value="false">
            Inactive
        </option>

    </select>

    <br><br>

    <button
        class="add-btn"
        onclick="updateEmployee(${id})">

        Update

    </button>

    <button onclick="loadEmployees()">

        Cancel

    </button>

    `;

    await loadDepartments();

    document.getElementById("deptID").value = emp.deptID;

    document.getElementById("status").value =
        emp.isActive.toString();

}
async function updateEmployee(id) {

    const employee = {

        empID: id,

        empName: document.getElementById("empName").value,

        deptID: Number(document.getElementById("deptID").value),

        isActive:
            document.getElementById("status").value === "true"

    };

    const token = localStorage.getItem("token");

    const response = await fetch(
        `https://localhost:7104/api/Employee/${id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify(employee)
        }
    );

    if (response.ok) {

        alert("Employee Updated Successfully");

        loadEmployees();

    }
    else {

        alert("Unable to Update Employee");

    }

}

async function loadDepartmentPage() {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch("https://localhost:7104/api/Department", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const departments = await response.json();

        let html = `

        <h2>Department Management</h2>

        <br>

        <button class="add-btn" onclick="showAddDepartmentForm()">
            + Add Department
        </button>

        <table>

            <tr>

                <th>ID</th>

                <th>Department</th>

                <th>Action</th>

            </tr>

        `;

        departments.forEach(dept => {

            html += `

            <tr>

                <td>${dept.deptID}</td>

                <td>${dept.deptName}</td>

                <td>

                    <button class="edit-btn"
                    onclick="editDepartment(${dept.deptID})">
                    Edit
                    </button>

                    <button class="delete-btn"
                    onclick="deleteDepartment(${dept.deptID})">
                    Delete
                    </button>

                </td>

            </tr>

            `;

        });

        html += "</table>";

        content.innerHTML = html;

    }
    catch {

        alert("Unable to load departments.");

    }

}
function showAddDepartmentForm() {

    content.innerHTML = `

    <h2>Add Department</h2>

    <input
        type="text"
        id="deptName"
        placeholder="Department Name">
    <input type="number" id="deptID" placeholder="Department ID">    

    <br><br>

    <button
        class="add-btn"
        onclick="saveDepartment()">

        Save Department

    </button>

    <button onclick="loadDepartmentPage()">

        Cancel

    </button>

    `;

}
async function saveDepartment() {

    const department = {

        deptID: Number(document.getElementById("deptID").value),

        deptName: document.getElementById("deptName").value

    };

    const token = localStorage.getItem("token");

    const response = await fetch(

        "https://localhost:7104/api/Department",

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`

            },

            body: JSON.stringify(department)

        }

    );

    if (response.ok) {

        alert("Department Added Successfully");

        loadDepartmentPage();

    }
    else {

        alert("Unable to Add Department");

    }

}
async function deleteDepartment(id) {

    if (!confirm("Delete this department?")) {

        return;

    }

    const token = localStorage.getItem("token");

    const response = await fetch(

        `https://localhost:7104/api/Department/${id}`,

        {

            method: "DELETE",

            headers: {

                "Authorization": `Bearer ${token}`

            }

        }

    );

    if (response.ok) {

        alert("Department Deleted Successfully");

        loadDepartmentPage();

    }
    else {

        alert("Unable to Delete Department");

    }

}
async function editDepartment(id) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `https://localhost:7104/api/Department/${id}`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    const dept = await response.json();

    content.innerHTML = `

        <h2>Edit Department</h2>

        <input
            type="text"
            id="deptName"
            value="${dept.deptName}">

        <br><br>

        <button class="add-btn"
            onclick="updateDepartment(${id})">

            Update

        </button>

        <button onclick="loadDepartmentPage()">

            Cancel

        </button>

    `;
}
async function updateDepartment(id) {
    const department = {
        deptID: id,
        deptName: document.getElementById("deptName").value
    };

    try {
        const response = await fetch(
            `https://localhost:7104/api/Department/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(department)
            }
        );

        if (response.ok) {
            alert("Department Updated Successfully");
            loadDepartmentPage();
        } else {
            alert("Unable to Update Department");
        }
    } catch {
        alert("Unable to connect to server.");
    }
}
async function loadAttendancePage() {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch("https://localhost:7104/api/Attendance", {

            headers: {

                "Authorization": `Bearer ${token}`

            }

        });

        const attendance = await response.json();

        let html = `

        <h2>Attendance Management</h2>

        <br>

        <button class="add-btn" onclick="showAddAttendanceForm()">
            + Mark Attendance
        </button>

        <table>

            <tr>

                <th>ID</th>

                <th>Employee</th>

                <th>Date</th>

                <th>Status</th>

                <th>Action</th>

            </tr>

        `;

        attendance.forEach(a => {

            html += `

            <tr>

                <td>${a.attendanceID}</td>

                <td>${a.empID}</td>

                <td>${a.attendanceDate}</td>

                <td>${a.status}</td>

                <td>

                    <button class="edit-btn"
                    onclick="editAttendance(${a.attendanceID})">

                        Edit

                    </button>

                    <button class="delete-btn"
onclick="deleteAttendance(${a.attendanceID})">
    Delete
</button>

                </td>

            </tr>

            `;

        });

        html += "</table>";

        content.innerHTML = html;

    }
    catch {

        alert("Unable to load attendance.");

    }

}
function showAddAttendanceForm() {

    content.innerHTML = `

    <h2>Mark Attendance</h2>

    <input
        type="number"
        id="empID"
        placeholder="Employee ID">

    <input
        type="date"
        id="date">

    <select id="status">

        <option>Present</option>

        <option>Absent</option>

        <option>Leave</option>

    </select>

    <br><br>

    <button
        class="add-btn"
        onclick="saveAttendance()">

        Save

    </button>

    <button onclick="loadAttendancePage()">

        Cancel

    </button>

    `;

}
async function saveAttendance() {

    const attendance = {

        empID: Number(document.getElementById("empID").value),

        attendanceDate: document.getElementById("date").value,

        status: document.getElementById("status").value

    };

    const token = localStorage.getItem("token");

    const response = await fetch(

        "https://localhost:7104/api/Attendance",

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`

            },

            body: JSON.stringify(attendance)

        }

    );

    if (response.ok) {

        alert("Attendance Added Successfully");

        loadAttendancePage();

    }
    else {

        alert("Unable to Add Attendance");

    }

}
async function editAttendance(id) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `https://localhost:7104/api/Attendance/${id}`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    const attendance = await response.json();

    content.innerHTML = `

        <h2>Edit Attendance</h2>

        <input
            type="number"
            id="empID"
            value="${attendance.empID}">

        <input
            type="date"
            id="attendanceDate"
            value="${attendance.attendanceDate.split("T")[0]}">

        <select id="status">

            <option value="Present">Present</option>

            <option value="Absent">Absent</option>

            <option value="Leave">Leave</option>

        </select>

        <br><br>

        <button
            class="add-btn"
            onclick="updateAttendance(${id})">

            Update

        </button>

        <button onclick="loadAttendancePage()">

            Cancel

        </button>

    `;

    document.getElementById("status").value = attendance.status;

}
async function updateAttendance(id) {

    const attendance = {

        attendanceID: id,

        empID: Number(document.getElementById("empID").value),

        attendanceDate: document.getElementById("attendanceDate").value,

        status: document.getElementById("status").value

    };

    const token = localStorage.getItem("token");

    const response = await fetch(

        `https://localhost:7104/api/Attendance/${id}`,

        {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`

            },

            body: JSON.stringify(attendance)

        }

    );

    if (response.ok) {

        alert("Attendance Updated Successfully");

        loadAttendancePage();

    }
    else {

        alert("Unable to Update Attendance");

    }

}
async function deleteAttendance(id) {

    if (!confirm("Are you sure you want to delete this attendance record?")) {

        return;

    }

    const token = localStorage.getItem("token");

    const response = await fetch(

        `https://localhost:7104/api/Attendance/${id}`,

        {

            method: "DELETE",

            headers: {

                "Authorization": `Bearer ${token}`

            }

        }

    );

    if (response.ok) {

        alert("Attendance Deleted Successfully");

        loadAttendancePage();

    }
    else {

        alert("Unable to Delete Attendance");

    }

}
async function loadLeavePage() {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(
            "https://localhost:7104/api/LeaveRequest",
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const leaves = await response.json();

        let html = `

        <h2>Leave Management</h2>

        <br>

        <button class="add-btn" onclick="showAddLeaveForm()">

            + Add Leave

        </button>

        <table>

            <tr>

                <th>ID</th>

                <th>Employee ID</th>

                <th>From</th>

                <th>To</th>

                <th>Status</th>

                <th>Action</th>

            </tr>

        `;

        leaves.forEach(leave => {

            html += `

            <tr>

                <td>${leave.leaveID}</td>

                <td>${leave.empID}</td>

                <td>${leave.fromDate.split("T")[0]}</td>

                <td>${leave.toDate.split("T")[0]}</td>

                <td>${leave.status}</td>

                <td>

                    <button class="edit-btn"
                    onclick="editLeave(${leave.leaveID})">

                        Edit

                    </button>

                    <button class="delete-btn"
                    onclick="deleteLeave(${leave.leaveID})">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        });

        html += "</table>";

        content.innerHTML = html;

    }
    catch {

        alert("Unable to load leave requests.");

    }

}
function showAddLeaveForm() {

    content.innerHTML = `

    <h2>Add Leave</h2>

    <input
        type="number"
        id="empID"
        placeholder="Employee ID">

    <input
        type="date"
        id="fromDate">

    <input
        type="date"
        id="toDate">

    <select id="status">

        <option>Pending</option>

        <option>Approved</option>

        <option>Rejected</option>

    </select>

    <br><br>

    <button
        class="add-btn"
        onclick="saveLeave()">

        Save

    </button>

    <button onclick="loadLeavePage()">

        Cancel

    </button>

    `;

}
async function saveLeave() {

    const leave = {

        empID: Number(document.getElementById("empID").value),

        fromDate: document.getElementById("fromDate").value,

        toDate: document.getElementById("toDate").value,

        status: document.getElementById("status").value

    };

    const token = localStorage.getItem("token");

    const response = await fetch(

        "https://localhost:7104/api/LeaveRequest",

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`

            },

            body: JSON.stringify(leave)

        }

    );
    if (response.ok) {

        alert("Leave Added Successfully");

        loadLeavePage();

    }
    else {

        alert("Unable to Add Leave");

    }

}
async function editLeave(id) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `https://localhost:7104/api/LeaveRequest/${id}`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    const leave = await response.json();

    content.innerHTML = `

        <h2>Edit Leave</h2>

        <input
            type="number"
            id="empID"
            value="${leave.empID}">

        <input
            type="date"
            id="fromDate"
            value="${leave.fromDate.split("T")[0]}">

        <input
            type="date"
            id="toDate"
            value="${leave.toDate.split("T")[0]}">

        <select id="status">

            <option value="Pending">Pending</option>

            <option value="Approved">Approved</option>

            <option value="Rejected">Rejected</option>

        </select>

        <br><br>

        <button
            class="add-btn"
            onclick="updateLeave(${id})">

            Update

        </button>

        <button onclick="loadLeavePage()">

            Cancel

        </button>

    `;

    document.getElementById("status").value = leave.status;

}
async function updateLeave(id) {

    const leave = {

        leaveID: id,

        empID: Number(document.getElementById("empID").value),

        fromDate: document.getElementById("fromDate").value,

        toDate: document.getElementById("toDate").value,

        status: document.getElementById("status").value

    };

    const token = localStorage.getItem("token");

    const response = await fetch(

        `https://localhost:7104/api/LeaveRequest/${id}`,

        {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`

            },

            body: JSON.stringify(leave)

        }

    );

    if (response.ok) {

        alert("Leave Updated Successfully");

        loadLeavePage();

    }
    else {

        alert("Unable to Update Leave");

    }

}
async function deleteLeave(id) {

    if (!confirm("Delete this leave request?")) {

        return;

    }

    const token = localStorage.getItem("token");

    const response = await fetch(

        `https://localhost:7104/api/LeaveRequest/${id}`,

        {

            method: "DELETE",

            headers: {

                "Authorization": `Bearer ${token}`

            }

        }

    );

    if (response.ok) {

        alert("Leave Deleted Successfully");

        loadLeavePage();

    }
    else {

        alert("Unable to Delete Leave");

    }

}
async function loadSalaryPage() {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(
            "https://localhost:7104/api/Salary",
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const salaries = await response.json();

        let html = `

        <h2>Salary Management</h2>

        <br>

        <button class="add-btn" onclick="showAddSalaryForm()">
            + Add Salary
        </button>

        <table>

            <tr>

                <th>ID</th>

                <th>Employee</th>

                <th>Basic Salary</th>

                <th>Bonus</th>

                <th>Deduction</th>

                <th>Net Salary</th>

                <th>Action</th>

            </tr>

        `;

        salaries.forEach(s => {

            html += `

            <tr>

                <td>${s.salaryID}</td>

                <td>${s.empID}</td>

                <td>${s.basicSalary}</td>

                <td>${s.bonus}</td>

                <td>${s.deduction}</td>

                <td>${s.netSalary}</td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editSalary(${s.salaryID})">

                        Edit

                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteSalary(${s.salaryID})">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        });

        html += "</table>";

        content.innerHTML = html;

    }

    catch {

        alert("Unable to load salary.");

    }

}
function showAddSalaryForm() {

    content.innerHTML = `

        <h2>Add Salary</h2>

        <input
            type="number"
            id="empID"
            placeholder="Employee ID">

        <input
            type="number"
            id="basicSalary"
            placeholder="Basic Salary">

        <input
            type="number"
            id="bonus"
            placeholder="Bonus">

        <input
            type="number"
            id="deduction"
            placeholder="Deduction">

        <br><br>

        <button
            class="add-btn"
            onclick="saveSalary()">

            Save

        </button>

        <button onclick="loadSalaryPage()">

            Cancel

        </button>

    `;

}
async function saveSalary() {

    const salary = {

        empID: Number(document.getElementById("empID").value),

        basicSalary: Number(document.getElementById("basicSalary").value),

        bonus: Number(document.getElementById("bonus").value),

        deduction: Number(document.getElementById("deduction").value)

    };

    const token = localStorage.getItem("token");

    const response = await fetch(

        "https://localhost:7104/api/Salary",

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`

            },

            body: JSON.stringify(salary)

        }

    );

    if (response.ok) {

        alert("Salary Added Successfully");

        loadSalaryPage();

    }

    else {

        alert("Unable to Add Salary");

    }

}

async function editSalary(id) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `https://localhost:7104/api/Salary/${id}`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    const salary = await response.json();



    content.innerHTML = `

        <h2>Edit Salary</h2>

        <input
            type="number"
            id="empID"
            value="${salary.empID}">

        <input
            type="number"
            id="basicSalary"
            value="${salary.basicSalary}">

        <input
            type="number"
            id="bonus"
            value="${salary.bonus}">

        <input
            type="number"
            id="deduction"
            value="${salary.deduction}">

        <br><br>

        <button
            class="add-btn"
            onclick="updateSalary(${id})">

            Update

        </button>

        <button onclick="loadSalaryPage()">

            Cancel

        </button>

    `;

}
async function updateSalary(id) {

    const salary = {

        salaryID: id,

        empID: Number(document.getElementById("empID").value),

        basicSalary: Number(document.getElementById("basicSalary").value),

        bonus: Number(document.getElementById("bonus").value),

        deduction: Number(document.getElementById("deduction").value)

    };

    const token = localStorage.getItem("token");

    const response = await fetch(

        `https://localhost:7104/api/Salary/${id}`,

        {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify(salary)

        }

    );
    if (response.ok) {

        alert("Salary Updated Successfully");

        loadSalaryPage();

    }
    else {

        alert("Unable to Update Salary");

    }

}
async function deleteSalary(id) {

    if (!confirm("Delete this salary record?")) {

        return;

    }

    const token = localStorage.getItem("token");

    const response = await fetch(

        `https://localhost:7104/api/Salary/${id}`,

        {

            method: "DELETE",

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    if (response.ok) {

        alert("Salary Deleted Successfully");

        loadSalaryPage();

    }
    else {

        alert("Unable to Delete Salary");

    }

}
const content = document.querySelector(".content");

const dashboardMenu = document.querySelector(".active");
const employeeMenu = document.getElementById("employeeMenu");
const departmentMenu = document.getElementById("departmentMenu");
const attendanceMenu = document.getElementById("attendanceMenu");
const leaveMenu = document.getElementById("leaveMenu");
const salaryMenu = document.getElementById("salaryMenu");
const logoutMenu = document.getElementById("logout");


// Remove Active Class
function clearActive() {

    document.querySelectorAll(".sidebar li").forEach(item => {

        item.classList.remove("active");

    });

}


// ================= Dashboard =================

dashboardMenu.addEventListener("click", () => {

    clearActive();

    dashboardMenu.classList.add("active");

    content.innerHTML = `

        <h2>Welcome Admin</h2>

        <p>

            Welcome to Sonalika Employee Management System.

            Select any module from the left sidebar.

        </p>

    `;

});


// ================= Employees =================

employeeMenu.addEventListener("click", () => {

    clearActive();

    employeeMenu.classList.add("active");

    loadEmployees();


});


// ================= Department =================

departmentMenu.addEventListener("click", () => {

    clearActive();

    departmentMenu.classList.add("active");

    loadDepartmentPage();

});


// ================= Attendance =================

attendanceMenu.addEventListener("click", () => {

    clearActive();

    attendanceMenu.classList.add("active");

    loadAttendancePage();

});


// ================= Leave =================

leaveMenu.addEventListener("click", () => {

    clearActive();

    leaveMenu.classList.add("active");

    loadLeavePage();

});


// ================= Salary =================

salaryMenu.addEventListener("click", () => {

    clearActive();

    salaryMenu.classList.add("active");

    loadSalaryPage();

});


// ================= Logout =================

logoutMenu.addEventListener("click", () => {

    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("token");
        localStorage.removeItem("empCode");
        window.location.href = "sonalikalogin.html";

    }

});