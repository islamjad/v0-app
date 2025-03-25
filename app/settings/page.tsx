"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, UserPlus, Upload } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { usePointOfSale } from "@/components/point-of-sale-provider"
import { useSession } from "next-auth/react"

export default function SettingsPage() {
  const { toast } = useToast()
  const { data: session } = useSession()
  const { currentPointOfSale } = usePointOfSale()
  const [activeTab, setActiveTab] = useState("users")
  const [users, setUsers] = useState([])
  const [salePoints, setSalePoints] = useState([])
  const [systemSettings, setSystemSettings] = useState({
    companyName: "Acme Inc",
    taxId: "123456789",
    address: "123 Business St, Suite 100",
    phone: "+1 (555) 123-4567",
    currency: "USD",
    darkMode: false,
    emailNotifications: true,
    autoBackup: true,
  })

  // User management
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [userDeleteDialogOpen, setUserDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  // Sale point management
  const [salePointDialogOpen, setSalePointDialogOpen] = useState(false)
  const [currentSalePoint, setCurrentSalePoint] = useState(null)
  const [salePointDeleteDialogOpen, setSalePointDeleteDialogOpen] = useState(false)
  const [salePointToDelete, setSalePointToDelete] = useState(null)
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState("")

  // User form data
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    status: "active",
    pointOfSaleId: "",
  })

  // Sale point form data
  const [salePointFormData, setSalePointFormData] = useState({
    name: "",
    address: "",
    phone: "",
    managerId: "",
    status: "active",
    logo: "",
  })

  useEffect(() => {
    // Fetch users for the current point of sale
    const fetchUsers = async () => {
      if (!currentPointOfSale) return

      try {
        const response = await fetch(`/api/users?pointOfSaleId=${currentPointOfSale.id}`)
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error("Failed to fetch users:", error)
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        })
      }
    }

    // Fetch all points of sale (admin only)
    const fetchPointsOfSale = async () => {
      if (session?.user?.role !== "admin") return

      try {
        const response = await fetch("/api/points-of-sale")
        const data = await response.json()
        setSalePoints(data)
      } catch (error) {
        console.error("Failed to fetch points of sale:", error)
        toast({
          title: "Error",
          description: "Failed to load points of sale. Please try again.",
          variant: "destructive",
        })
      }
    }

    // Fetch system settings
    const fetchSystemSettings = async () => {
      try {
        const response = await fetch("/api/settings")
        const data = await response.json()
        setSystemSettings(data)
      } catch (error) {
        console.error("Failed to fetch system settings:", error)
      }
    }

    fetchUsers()
    fetchPointsOfSale()
    fetchSystemSettings()
  }, [currentPointOfSale, session, toast])

  // User management functions
  const openAddUserDialog = () => {
    setCurrentUser(null)
    setUserFormData({
      name: "",
      email: "",
      password: "",
      role: "staff",
      status: "active",
      pointOfSaleId: currentPointOfSale?.id || "",
    })
    setUserDialogOpen(true)
  }

  const openEditUserDialog = (user) => {
    setCurrentUser(user)
    setUserFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
      pointOfSaleId: user.pointOfSaleId || currentPointOfSale?.id || "",
    })
    setUserDialogOpen(true)
  }

  const openDeleteUserDialog = (user) => {
    setUserToDelete(user)
    setUserDeleteDialogOpen(true)
  }

  const handleUserFormChange = (e) => {
    const { name, value } = e.target
    setUserFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUserRoleChange = (value) => {
    setUserFormData((prev) => ({
      ...prev,
      role: value,
    }))
  }

  const handleUserStatusChange = (value) => {
    setUserFormData((prev) => ({
      ...prev,
      status: value,
    }))
  }

  const handleUserPointOfSaleChange = (value) => {
    setUserFormData((prev) => ({
      ...prev,
      pointOfSaleId: value,
    }))
  }

  const handleSaveUser = async (e) => {
    e.preventDefault()

    try {
      const url = currentUser ? `/api/users/${currentUser.id}` : "/api/users"

      const method = currentUser ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userFormData),
      })

      if (!response.ok) {
        throw new Error("Failed to save user")
      }

      const savedUser = await response.json()

      if (currentUser) {
        setUsers(users.map((user) => (user.id === savedUser.id ? savedUser : user)))
      } else {
        setUsers([...users, savedUser])
      }

      setUserDialogOpen(false)
      toast({
        title: currentUser ? "User Updated" : "User Created",
        description: currentUser
          ? `${savedUser.name} has been updated successfully.`
          : `${savedUser.name} has been added successfully.`,
      })
    } catch (error) {
      console.error("Failed to save user:", error)
      toast({
        title: "Error",
        description: "Failed to save user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    try {
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete user")
      }

      setUsers(users.filter((user) => user.id !== userToDelete.id))
      setUserDeleteDialogOpen(false)
      setUserToDelete(null)

      toast({
        title: "User Deleted",
        description: `${userToDelete.name} has been deleted successfully.`,
      })
    } catch (error) {
      console.error("Failed to delete user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Sale point management functions
  const openAddSalePointDialog = () => {
    setCurrentSalePoint(null)
    setSalePointFormData({
      name: "",
      address: "",
      phone: "",
      managerId: "",
      status: "active",
      logo: "",
    })
    setLogoPreview("")
    setLogoFile(null)
    setSalePointDialogOpen(true)
  }

  const openEditSalePointDialog = (salePoint) => {
    setCurrentSalePoint(salePoint)
    setSalePointFormData({
      name: salePoint.name,
      address: salePoint.address,
      phone: salePoint.phone,
      managerId: salePoint.managerId || "",
      status: salePoint.status,
      logo: salePoint.logo || "",
    })
    setLogoPreview(salePoint.logo || "")
    setLogoFile(null)
    setSalePointDialogOpen(true)
  }

  const openDeleteSalePointDialog = (salePoint) => {
    setSalePointToDelete(salePoint)
    setSalePointDeleteDialogOpen(true)
  }

  const handleSalePointFormChange = (e) => {
    const { name, value } = e.target
    setSalePointFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSalePointManagerChange = (value) => {
    setSalePointFormData((prev) => ({
      ...prev,
      managerId: value,
    }))
  }

  const handleSalePointStatusChange = (value) => {
    setSalePointFormData((prev) => ({
      ...prev,
      status: value,
    }))
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveSalePoint = async (e) => {
    e.preventDefault()

    try {
      // First, upload the logo if there's a new one
      let logoUrl = salePointFormData.logo

      if (logoFile) {
        const formData = new FormData()
        formData.append("file", logoFile)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload logo")
        }

        const { url } = await uploadResponse.json()
        logoUrl = url
      }

      // Then save the point of sale data
      const url = currentSalePoint ? `/api/points-of-sale/${currentSalePoint.id}` : "/api/points-of-sale"

      const method = currentSalePoint ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...salePointFormData,
          logo: logoUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save point of sale")
      }

      const savedSalePoint = await response.json()

      if (currentSalePoint) {
        setSalePoints(salePoints.map((sp) => (sp.id === savedSalePoint.id ? savedSalePoint : sp)))
      } else {
        setSalePoints([...salePoints, savedSalePoint])
      }

      setSalePointDialogOpen(false)
      toast({
        title: currentSalePoint ? "Point of Sale Updated" : "Point of Sale Created",
        description: currentSalePoint
          ? `${savedSalePoint.name} has been updated successfully.`
          : `${savedSalePoint.name} has been added successfully.`,
      })
    } catch (error) {
      console.error("Failed to save point of sale:", error)
      toast({
        title: "Error",
        description: "Failed to save point of sale. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSalePoint = async () => {
    if (!salePointToDelete) return

    try {
      const response = await fetch(`/api/points-of-sale/${salePointToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete point of sale")
      }

      setSalePoints(salePoints.filter((sp) => sp.id !== salePointToDelete.id))
      setSalePointDeleteDialogOpen(false)
      setSalePointToDelete(null)

      toast({
        title: "Point of Sale Deleted",
        description: `${salePointToDelete.name} has been deleted successfully.`,
      })
    } catch (error) {
      console.error("Failed to delete point of sale:", error)
      toast({
        title: "Error",
        description: "Failed to delete point of sale. Please try again.",
        variant: "destructive",
      })
    }
  }

  // System settings functions
  const handleSystemSettingChange = (e) => {
    const { name, value } = e.target
    setSystemSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCurrencyChange = (value) => {
    setSystemSettings((prev) => ({
      ...prev,
      currency: value,
    }))
  }

  const handleToggleChange = (name, checked) => {
    setSystemSettings((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSaveSettings = async () => {
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(systemSettings),
      })

      if (!response.ok) {
        throw new Error("Failed to save settings")
      }

      toast({
        title: "Settings saved",
        description: "Your system settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case "USD":
        return "$"
      case "EUR":
        return "€"
      case "ILS":
        return "₪"
      default:
        return "$"
    }
  }

  // Check if user has permission to view this page
  if (!session?.user?.role || (session.user.role !== "admin" && session.user.role !== "manager")) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please contact your administrator for access.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">System Settings</h1>
        {currentPointOfSale && (
          <div className="flex items-center gap-2">
            <span>Current Point of Sale:</span>
            <Badge variant="outline" className="font-semibold">
              {currentPointOfSale.name}
            </Badge>
          </div>
        )}
      </div>

      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          {session.user.role === "admin" && <TabsTrigger value="sale-points">Points of Sale</TabsTrigger>}
          <TabsTrigger value="general">General Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage users and their access to the system.</CardDescription>
              </div>
              <Button onClick={openAddUserDialog}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "admin" ? "default" : user.role === "manager" ? "secondary" : "outline"
                            }
                          >
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "success" : "destructive"}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openEditUserDialog(user)}>
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-100"
                              onClick={() => openDeleteUserDialog(user)}
                              disabled={user.role === "admin" || user.id === session.user.id} // Prevent deleting admin or self
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {session.user.role === "admin" && (
          <TabsContent value="sale-points">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Points of Sale</CardTitle>
                  <CardDescription>Manage store locations and points of sale.</CardDescription>
                </div>
                <Button onClick={openAddSalePointDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Point of Sale
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Logo</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salePoints.length > 0 ? (
                      salePoints.map((salePoint) => (
                        <TableRow key={salePoint.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{salePoint.name}</p>
                              <p className="text-xs text-muted-foreground">{salePoint.id}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {salePoint.logo ? (
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={salePoint.logo} alt={salePoint.name} />
                                <AvatarFallback>{salePoint.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">{salePoint.name.charAt(0)}</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{salePoint.address}</TableCell>
                          <TableCell>{salePoint.phone}</TableCell>
                          <TableCell>{salePoint.manager?.name || "Not assigned"}</TableCell>
                          <TableCell>
                            <Badge variant={salePoint.status === "active" ? "success" : "destructive"}>
                              {salePoint.status.charAt(0).toUpperCase() + salePoint.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => openEditSalePointDialog(salePoint)}>
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                onClick={() => openDeleteSalePointDialog(salePoint)}
                                disabled={salePoints.length <= 1} // Prevent deleting the last point of sale
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
                          No points of sale found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure system-wide settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Company Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={systemSettings.companyName}
                      onChange={handleSystemSettingChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                    <Input id="taxId" name="taxId" value={systemSettings.taxId} onChange={handleSystemSettingChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={systemSettings.address}
                      onChange={handleSystemSettingChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" value={systemSettings.phone} onChange={handleSystemSettingChange} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Currency Settings</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select value={systemSettings.currency} onValueChange={handleCurrencyChange}>
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">EUR - Euro (€)</SelectItem>
                        <SelectItem value="ILS">ILS - Israeli Shekel (₪)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      This will be the default currency used throughout the system.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">System Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="darkMode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable dark mode for the application</p>
                    </div>
                    <Switch
                      id="darkMode"
                      checked={systemSettings.darkMode}
                      onCheckedChange={(checked) => handleToggleChange("darkMode", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive email notifications for new orders</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={systemSettings.emailNotifications}
                      onCheckedChange={(checked) => handleToggleChange("emailNotifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoBackup">Automatic Backups</Label>
                      <p className="text-sm text-muted-foreground">Create automatic backups of your data</p>
                    </div>
                    <Switch
                      id="autoBackup"
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) => handleToggleChange("autoBackup", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentUser ? "Edit User" : "Add User"}</DialogTitle>
            <DialogDescription>
              {currentUser ? "Update user information and access rights." : "Fill in the details to add a new user."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveUser}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={userFormData.name} onChange={handleUserFormChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userFormData.email}
                  onChange={handleUserFormChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{currentUser ? "Password (leave blank to keep current)" : "Password"}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={userFormData.password}
                  onChange={handleUserFormChange}
                  required={!currentUser}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={userFormData.role} onValueChange={handleUserRoleChange} defaultValue="staff">
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {session.user.role === "admin" && <SelectItem value="admin">Admin</SelectItem>}
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {session.user.role === "admin" && (
                <div className="grid gap-2">
                  <Label htmlFor="pointOfSale">Point of Sale</Label>
                  <Select value={userFormData.pointOfSaleId} onValueChange={handleUserPointOfSaleChange}>
                    <SelectTrigger id="pointOfSale">
                      <SelectValue placeholder="Select point of sale" />
                    </SelectTrigger>
                    <SelectContent>
                      {salePoints.map((pos) => (
                        <SelectItem key={pos.id} value={pos.id}>
                          {pos.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={userFormData.status} onValueChange={handleUserStatusChange} defaultValue="active">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{currentUser ? "Save Changes" : "Add User"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* User Delete Dialog */}
      <AlertDialog open={userDeleteDialogOpen} onOpenChange={setUserDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user {userToDelete?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sale Point Dialog */}
      <Dialog open={salePointDialogOpen} onOpenChange={setSalePointDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentSalePoint ? "Edit Point of Sale" : "Add Point of Sale"}</DialogTitle>
            <DialogDescription>
              {currentSalePoint
                ? "Update point of sale information."
                : "Fill in the details to add a new point of sale."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveSalePoint}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={salePointFormData.name}
                  onChange={handleSalePointFormChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center gap-4">
                  {(logoPreview || salePointFormData.logo) && (
                    <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                      <img
                        src={logoPreview || salePointFormData.logo}
                        alt="Logo preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <Label
                      htmlFor="logo-upload"
                      className="flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      <span>Upload Logo</span>
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Recommended size: 200x200px. Max size: 2MB.</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={salePointFormData.address}
                  onChange={handleSalePointFormChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={salePointFormData.phone}
                  onChange={handleSalePointFormChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="manager">Manager</Label>
                <Select value={salePointFormData.managerId} onValueChange={handleSalePointManagerChange}>
                  <SelectTrigger id="manager">
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter((user) => user.role === "manager" || user.role === "admin")
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={salePointFormData.status} onValueChange={handleSalePointStatusChange}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{currentSalePoint ? "Save Changes" : "Add Point of Sale"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sale Point Delete Dialog */}
      <AlertDialog open={salePointDeleteDialogOpen} onOpenChange={setSalePointDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the point of sale {salePointToDelete?.name} and all associated data. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSalePoint} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

