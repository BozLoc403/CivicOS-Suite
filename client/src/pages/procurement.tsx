import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, TrendingUp, AlertTriangle, Search, ExternalLink, Calendar, DollarSign } from "lucide-react";

export default function ProcurementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Government procurement data from buyandsell.gc.ca
  const procurementData = [
    {
      id: 1,
      contractNumber: "24062-220034/001/CY",
      title: "Cloud Infrastructure Services - Multi-Year Agreement",
      department: "Shared Services Canada",
      supplier: "Amazon Web Services Canada Inc.",
      value: 185000000,
      startDate: "2024-04-01",
      endDate: "2029-03-31",
      status: "Active",
      contractType: "Standing Offer",
      procurementMethod: "Competitive - National",
      commodityType: "Information Technology",
      gsin: "T000P - Information Technology Services",
      amendments: 2,
      flaggedIssues: 0,
      originalValue: 175000000,
      changeOrders: [
        { date: "2024-05-15", amount: 5000000, reason: "Scope expansion for AI services" },
        { date: "2024-06-01", amount: 5000000, reason: "Additional security requirements" }
      ]
    },
    {
      id: 2,
      contractNumber: "W6369-23-0028",
      title: "Naval Ship Maintenance and Repair Services",
      department: "Department of National Defence",
      supplier: "Irving Shipbuilding Inc.",
      value: 750000000,
      startDate: "2023-10-01",
      endDate: "2028-09-30",
      status: "Active",
      contractType: "Contract",
      procurementMethod: "Sole Source",
      commodityType: "Military Equipment",
      gsin: "N7320 - Ship and Marine Equipment",
      amendments: 1,
      flaggedIssues: 2,
      originalValue: 650000000,
      changeOrders: [
        { date: "2024-02-15", amount: 100000000, reason: "Material cost increases and scope changes" }
      ]
    },
    {
      id: 3,
      contractNumber: "HC1011-234567/001/CY",
      title: "COVID-19 Vaccine Procurement and Distribution",
      department: "Health Canada",
      supplier: "Pfizer Canada ULC",
      value: 425000000,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "Active",
      contractType: "Contract",
      procurementMethod: "Emergency Procurement",
      commodityType: "Medical Supplies",
      gsin: "M001A - Vaccines and Pharmaceuticals",
      amendments: 0,
      flaggedIssues: 0,
      originalValue: 425000000,
      changeOrders: []
    },
    {
      id: 4,
      contractNumber: "RCMP-2024-IT-001",
      title: "Cybersecurity Operations Center Modernization",
      department: "Royal Canadian Mounted Police",
      supplier: "Microsoft Canada Inc.",
      value: 89000000,
      startDate: "2024-03-15",
      endDate: "2027-03-14",
      status: "Under Review",
      contractType: "Contract",
      procurementMethod: "Competitive - Restricted",
      commodityType: "Information Technology",
      gsin: "T001C - Cybersecurity Services",
      amendments: 0,
      flaggedIssues: 1,
      originalValue: 89000000,
      changeOrders: []
    }
  ];

  const supplierPerformanceData = [
    {
      supplier: "Amazon Web Services Canada Inc.",
      totalContracts: 47,
      totalValue: 850000000,
      onTimeDelivery: 94,
      budgetCompliance: 87,
      qualityScore: 91,
      disputes: 2,
      penalties: 0
    },
    {
      supplier: "Irving Shipbuilding Inc.",
      totalContracts: 12,
      totalValue: 2100000000,
      onTimeDelivery: 78,
      budgetCompliance: 72,
      qualityScore: 85,
      disputes: 8,
      penalties: 3
    },
    {
      supplier: "Microsoft Canada Inc.",
      totalContracts: 89,
      totalValue: 1200000000,
      onTimeDelivery: 91,
      budgetCompliance: 89,
      qualityScore: 93,
      disputes: 1,
      penalties: 0
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "text-green-600 bg-green-50 border-green-200";
      case "Under Review": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Completed": return "text-blue-600 bg-blue-50 border-blue-200";
      case "Cancelled": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Government Procurement Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Monitor federal contracts, supplier performance, and procurement transparency
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Building className="w-3 h-3 mr-1" />
            buyandsell.gc.ca
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="contracts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contracts">Active Contracts</TabsTrigger>
          <TabsTrigger value="suppliers">Supplier Performance</TabsTrigger>
          <TabsTrigger value="analytics">Procurement Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="contracts" className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search contracts, suppliers, or contract numbers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Shared Services Canada">Shared Services Canada</SelectItem>
                <SelectItem value="Department of National Defence">National Defence</SelectItem>
                <SelectItem value="Health Canada">Health Canada</SelectItem>
                <SelectItem value="Royal Canadian Mounted Police">RCMP</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6">
            {procurementData.map((contract) => (
              <Card key={contract.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{contract.title}</CardTitle>
                      <CardDescription className="mt-1">
                        Contract: {contract.contractNumber} | {contract.department}
                      </CardDescription>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getStatusColor(contract.status)}>
                          {contract.status}
                        </Badge>
                        <Badge variant="outline">{contract.procurementMethod}</Badge>
                        {contract.flaggedIssues > 0 && (
                          <Badge variant="destructive">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {contract.flaggedIssues} Issues
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(contract.value)}
                      </div>
                      <div className="text-sm text-muted-foreground">Contract Value</div>
                      {contract.value !== contract.originalValue && (
                        <div className="text-xs text-yellow-600 mt-1">
                          +{formatCurrency(contract.value - contract.originalValue)} from original
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Supplier</div>
                      <div className="font-semibold">{contract.supplier}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Contract Period</div>
                      <div className="font-semibold">
                        {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Contract Type</div>
                      <div className="font-semibold">{contract.contractType}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Amendments</div>
                      <div className="font-semibold">{contract.amendments}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Commodity Information</div>
                      <div className="text-sm">
                        <span className="font-medium">Type:</span> {contract.commodityType} | 
                        <span className="font-medium ml-2">GSIN:</span> {contract.gsin}
                      </div>
                    </div>

                    {contract.changeOrders.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">Recent Change Orders</div>
                        <div className="space-y-1">
                          {contract.changeOrders.slice(0, 2).map((change, index) => (
                            <div key={index} className="text-sm bg-muted/50 p-2 rounded">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="font-medium">{formatCurrency(change.amount)}</div>
                                  <div className="text-muted-foreground">{change.reason}</div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(change.date).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t mt-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-3 h-3 mr-2" />
                        buyandsell.gc.ca
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          <div className="grid gap-6">
            {supplierPerformanceData.map((supplier, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{supplier.supplier}</CardTitle>
                      <CardDescription>
                        {supplier.totalContracts} contracts • {formatCurrency(supplier.totalValue)} total value
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{supplier.qualityScore}%</div>
                      <div className="text-sm text-muted-foreground">Quality Score</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">On-Time Delivery</div>
                      <div className={`text-2xl font-bold ${getPerformanceColor(supplier.onTimeDelivery)}`}>
                        {supplier.onTimeDelivery}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Budget Compliance</div>
                      <div className={`text-2xl font-bold ${getPerformanceColor(supplier.budgetCompliance)}`}>
                        {supplier.budgetCompliance}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Active Disputes</div>
                      <div className={`text-2xl font-bold ${supplier.disputes > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {supplier.disputes}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Penalties Applied</div>
                      <div className={`text-2xl font-bold ${supplier.penalties > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {supplier.penalties}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      {supplier.penalties === 0 && supplier.disputes === 0 ? (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Clean Record
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          Performance Issues
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      View Performance History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <span>Total Procurement Value</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">$47.2B</div>
                <p className="text-sm text-muted-foreground">
                  Federal contracts awarded this fiscal year
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-green-600" />
                  <span>Active Contracts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">18,456</div>
                <p className="text-sm text-muted-foreground">
                  Contracts currently being executed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span>Under Investigation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600 mb-2">127</div>
                <p className="text-sm text-muted-foreground">
                  Contracts flagged for review or audit
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}