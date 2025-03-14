"use client";

import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  
  useEffect(() => {
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            const res = await fetch(`${API_URL}/api/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            console.log("API Response:", data);

            if (!Array.isArray(data.users)) {
                throw new Error("Invalid response format: users is not an array");
            }

            setUsers(data.users);  // ✅ Use data.users instead of data
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            console.error("Error fetching users:", errorMessage);
        }
    };

    fetchUsers();
  }, [API_URL]); // ✅ Only API_URL in dependencies


    const deleteUser = async (userId: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
      
        try {
          const res = await fetch(`${API_URL}/api/users/${userId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
      
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Failed to delete user");
      
          console.log("User deleted successfully");
          setUsers(users.filter((user) => user._id !== userId)); // ✅ Remove deleted user from UI
        } catch (error) {
          console.error("Error deleting user:", error);
        }
    };

    const updateUser = async (userId: string, updatedRole: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");
    
            const res = await fetch(`${API_URL}/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ role: updatedRole }), // ✅ Send as JSON
            });
    
            if (!res.ok) {
                const errorMessage = await res.text();
                throw new Error(errorMessage);
            }
    
            const updatedUser = await res.json();
            console.log("User updated successfully:", updatedUser);
    
            // Update UI
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === userId ? { ...user, role: updatedRole } : user
                )
              );
            }catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            console.error("Error updating user:", errorMessage);
        }
    };
    
    
    
      
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">Manage Users</h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-100">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">
                        <button 
                          onClick={() => deleteUser(user._id)} 
                          className="bg-red-500 text-white px-3 py-1 rounded mr-2"
                        >
                          Delete
                        </button>
                        <button 
                            onClick={() => updateUser(user._id, user.role === "admin" ? "user" : "admin")} 
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                            Edit
                        </button>
                    </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-3 text-center text-gray-500">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


            // "use client";
            
            // import { useEffect, useState } from "react";
            
            // interface User {
            //   _id: string;
            //   name: string;
            //   email: string;
            //   role: string;
            // }
            
            // export default function ManageUsers() {
            //   const [users, setUsers] = useState<User[]>([]);
            //   const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            
            //   useEffect(() => {
            //     fetchUsers();
            //   }, []);
            //     const fetchUsers = async () => {
            //         try {
            //             const token = localStorage.getItem("token");
            //             if (!token) throw new Error("No token found");
            
            //             const res = await fetch(`${API_URL}/api/users`, {
            //                 method: "GET",
            //                 headers: {
            //                     "Content-Type": "application/json",
            //                     Authorization: `Bearer ${token}`,
            //                 },
            //             });
            
            //             const data = await res.json();
            //             console.log("API Response:", data);
            
            //             if (!Array.isArray(data.users)) {
            //                 throw new Error("Invalid response format: users is not an array");
            //             }
            
            //             setUsers(data.users);  // ✅ Use data.users instead of data
            //         } catch (error) {
            //             const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            //             console.error("Error fetching users:", errorMessage);
            //         }
            //     };
            
            //     const deleteUser = async (userId: string) => {
            //         const token = localStorage.getItem("token");
            //         if (!token) {
            //           console.error("No token found");
            //           return;
            //         }
                  
            //         try {
            //           const res = await fetch(`${API_URL}/api/users/${userId}`, {
            //             method: "DELETE",
            //             headers: {
            //               "Content-Type": "application/json",
            //               Authorization: `Bearer ${token}`,
            //             },
            //           });
                  
            //           const data = await res.json();
            //           if (!res.ok) throw new Error(data.message || "Failed to delete user");
                  
            //           console.log("User deleted successfully");
            //           setUsers(users.filter((user) => user._id !== userId)); // ✅ Remove deleted user from UI
            //         } catch (error) {
            //           console.error("Error deleting user:", error);
            //         }
            //     };
            
            //     const updateUser = async (userId: string, updatedRole: string) => {
            //         try {
            //             const token = localStorage.getItem("token");
            //             if (!token) throw new Error("No token found");
                
            //             const res = await fetch(`${API_URL}/api/users/${userId}`, {
            //                 method: "PUT",
            //                 headers: {
            //                     "Content-Type": "application/json",
            //                     Authorization: `Bearer ${token}`,
            //                 },
            //                 body: JSON.stringify({ role: updatedRole }), // ✅ Send as JSON
            //             });
                
            //             if (!res.ok) {
            //                 const errorMessage = await res.text();
            //                 throw new Error(errorMessage);
            //             }
                
            //             const updatedUser = await res.json();
            //             console.log("User updated successfully:", updatedUser);
                
            //             // Update UI
            //             setUsers((prevUsers) =>
            //                 prevUsers.map((user) =>
            //                     user._id === userId ? { ...user, role: updatedRole } : user
            //                 )
            //             );
            //         }catch (error) {
            //             const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            //             console.error("Error updating user:", errorMessage);
            //         }
            //     };
                
                
            
                  
            //   return (
            //     <div className="p-6 max-w-6xl mx-auto">
            //       <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">Manage Users</h1>
            
            //       <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
            //         <table className="w-full border-collapse">
            //           <thead>
            //             <tr className="bg-gray-800 text-white">
            //               <th className="p-3 text-left">Name</th>
            //               <th className="p-3 text-left">Email</th>
            //               <th className="p-3 text-left">Role</th>
            //               <th className="p-3 text-left">Actions</th>
            //             </tr>
            //           </thead>
            //           <tbody>
            //             {users.length > 0 ? (
            //               users.map((user) => (
            //                 <tr key={user._id} className="border-b hover:bg-gray-100">
            //                     <td className="p-3">{user.name}</td>
            //                     <td className="p-3">{user.email}</td>
            //                     <td className="p-3">{user.role}</td>
            //                     <td className="p-3">
            //                         <button 
            //                           onClick={() => deleteUser(user._id)} 
            //                           className="bg-red-500 text-white px-3 py-1 rounded mr-2"
            //                         >
            //                           Delete
            //                         </button>
            //                         <button 
            //                             onClick={() => updateUser(user._id, user.role === "admin" ? "user" : "admin")} 
            //                             className="bg-blue-500 text-white px-3 py-1 rounded"
            //                         >
            //                             Edit
            //                         </button>
            //                     </td>
            
            //                 </tr>
            //               ))
            //             ) : (
            //               <tr>
            //                 <td colSpan={4} className="p-3 text-center text-gray-500">No users found</td>
            //               </tr>
            //             )}
            //           </tbody>
            //         </table>
            //       </div>
            //     </div>
            //   );
            // }
