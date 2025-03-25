"use client"

import { useState } from "react"
import { Plus, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CustomerDialog } from "@/components/customer-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Sample customer data
const initialCustomers = [
  {
    id: "CUST-001",
    name: "John Doe",
    phone: "+1 (555) 123-4567",
    city: "New York",
    address: "123 Broadway St, Apt 4B",
    email: "john.doe@example.com",
  },
  {
    id: "CUST-002",
    name: "Jane Smith",
    phone: "+1 (555) 987-6543",
    city: "Los Angeles",
    address: "456 Hollywood Blvd",
    email: "jane.smith@example.com",
  },
  {
    id: "CUST-003",
    name: "Robert Johnson",
    phone: "+1 (555) 456-7890",
    city: "Chicago",
    address: "789 Michigan Ave",
    email: "robert.johnson@example.com",
  },
  {
    id: "CUST-004",
    name: "Emily Davis",
    phone: "+1 (555) 234-5678",
    city: "Houston",
    address: "321 Texas St",
    email: "emily.davis@example.com",
  },
  {
    id: "CUST-005",
    name: "Michael Wilson",
    phone: "+1 (555) 876-5432",
    city: "Miami",
    address: "654 Beach Rd",
    email: "michael.wilson@example.com",
  },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState(null)

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.city.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddCustomer = (newCustomer) => {
    const customerId = `CUST-${String(customers.length + 1).padStart(3, "0")}`
    setCustomers([...customers, { ...newCustomer, id: customerId }])
  }

  const handleEditCustomer = (updatedCustomer) => {
    setCustomers(customers.map((customer) => (customer.id === updatedCustomer.id ? updatedCustomer : customer)))
  }

  const openAddDialog = () => {
    setCurrentCustomer(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (customer) => {
    setCurrentCustomer(customer)
    setIsDialogOpen(true)
  }

  const openDeleteDialog = (customer) => {
    setCustomerToDelete(customer)
    setDeleteDialogOpen(true)
  }

  const handleDeleteCustomer = () => {
    if (customerToDelete) {
      setCustomers(customers.filter((customer) => customer.id !== customerToDelete.id))
      setDeleteDialogOpen(false)
      setCustomerToDelete(null)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>
      <div className="flex items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.city}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{customer.address}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(customer)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => openDeleteDialog(customer)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <CustomerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        customer={currentCustomer}
        onSave={currentCustomer ? handleEditCustomer : handleAddCustomer}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the customer {customerToDelete?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCustomer} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

