"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompactBalanceSummary } from "@/components/ui/compact-balance-summary";
import { HealthcareBalanceCarousel } from "@/components/ui/healthcare-balance-carousel";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Filter,
  Heart,
  Search,
  TrendingUp,
  Wallet,
  XCircle
} from "lucide-react";
import { useState } from "react";

// Mock transaction data
const mockTransactions = [
  {
    id: "1",
    date: "2024-01-15",
    description: "Dr. Sarah Johnson - Cardiology Consultation",
    amount: -150.00,
    type: "medical" as const,
    account: "HSA" as const,
    status: "completed" as const,
    category: "Specialist Visit"
  },
  {
    id: "2", 
    date: "2024-01-14",
    description: "CVS Pharmacy - Prescription Medication",
    amount: -45.50,
    type: "pharmacy" as const,
    account: "HSA" as const,
    status: "completed" as const,
    category: "Prescription"
  },
  {
    id: "3",
    date: "2024-01-12", 
    description: "Gym Membership - Monthly Fee",
    amount: -29.99,
    type: "wellness" as const,
    account: "WSA" as const,
    status: "completed" as const,
    category: "Fitness"
  },
  {
    id: "4",
    date: "2024-01-10",
    description: "Employer Contribution - HSA",
    amount: 200.00,
    type: "contribution" as const,
    account: "HSA" as const,
    status: "completed" as const,
    category: "Contribution"
  },
  {
    id: "5",
    date: "2024-01-08",
    description: "LabCorp - Blood Work",
    amount: -85.00,
    type: "medical" as const,
    account: "HSA" as const,
    status: "pending" as const,
    category: "Lab Tests"
  },
  {
    id: "6",
    date: "2024-01-05",
    description: "Dental Cleaning - Dr. Smith",
    amount: -120.00,
    type: "medical" as const,
    account: "HSA" as const,
    status: "completed" as const,
    category: "Dental"
  },
  {
    id: "7",
    date: "2024-01-03",
    description: "Yoga Class - Wellness Center",
    amount: -15.00,
    type: "wellness" as const,
    account: "WSA" as const,
    status: "completed" as const,
    category: "Fitness"
  },
  {
    id: "8",
    date: "2024-01-01",
    description: "Annual HSA Contribution",
    amount: 1000.00,
    type: "contribution" as const,
    account: "HSA" as const,
    status: "completed" as const,
    category: "Contribution"
  }
];

const mockBalances = [
  {
    label: "HSA Balance",
    amount: 800,
    description: "Health Savings Account",
    icon: <Heart className="h-4 w-4" />,
    color: "primary" as const
  },
  {
    label: "WSA Balance", 
    amount: 450,
    description: "Wellness Savings Account",
    icon: <TrendingUp className="h-4 w-4" />,
    color: "secondary" as const
  },
  {
    label: "Total Available",
    amount: 1250,
    description: "Ready to use",
    icon: <DollarSign className="h-4 w-4" />,
    color: "accent" as const
  }
];

const getTransactionIcon = (type: string) => {
  switch (type) {
    case "medical":
      return <Heart className="h-4 w-4" />;
    case "pharmacy":
      return <CreditCard className="h-4 w-4" />;
    case "wellness":
      return <TrendingUp className="h-4 w-4" />;
    case "contribution":
      return <ArrowUp className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

// Filter Drawer Component
function FilterDrawer({ 
  selectedAccount, 
  setSelectedAccount, 
  selectedType, 
  setSelectedType, 
  selectedStatus, 
  setSelectedStatus 
}: {
  selectedAccount: string;
  setSelectedAccount: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="sm:hidden">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[500px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Transactions
          </SheetTitle>
          <SheetDescription>
            Adjust your filters to find specific transactions
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          {/* Account Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              <label className="text-sm font-medium">Account Type</label>
            </div>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gray-400" />
                    All Accounts
                  </div>
                </SelectItem>
                <SelectItem value="HSA">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    HSA (Health Savings)
                  </div>
                </SelectItem>
                <SelectItem value="WSA">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-secondary-foreground" />
                    WSA (Wellness Savings)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Transaction Type Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <label className="text-sm font-medium">Transaction Type</label>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gray-400" />
                    All Types
                  </div>
                </SelectItem>
                <SelectItem value="medical">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    Medical
                  </div>
                </SelectItem>
                <SelectItem value="pharmacy">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-500" />
                    Pharmacy
                  </div>
                </SelectItem>
                <SelectItem value="wellness">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Wellness
                  </div>
                </SelectItem>
                <SelectItem value="contribution">
                  <div className="flex items-center gap-2">
                    <ArrowUp className="h-4 w-4 text-emerald-500" />
                    Contribution
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Status Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <label className="text-sm font-medium">Transaction Status</label>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gray-400" />
                    All Status
                  </div>
                </SelectItem>
                <SelectItem value="completed">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Completed
                  </div>
                </SelectItem>
                <SelectItem value="pending">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    Pending
                  </div>
                </SelectItem>
                <SelectItem value="failed">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    Failed
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Summary */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Active Filters</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedAccount !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Wallet className="h-3 w-3" />
                  {selectedAccount}
                </Badge>
              )}
              {selectedType !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedType === "medical" && <Heart className="h-3 w-3" />}
                  {selectedType === "pharmacy" && <CreditCard className="h-3 w-3" />}
                  {selectedType === "wellness" && <TrendingUp className="h-3 w-3" />}
                  {selectedType === "contribution" && <ArrowUp className="h-3 w-3" />}
                  {selectedType}
                </Badge>
              )}
              {selectedStatus !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedStatus === "completed" && <CheckCircle className="h-3 w-3" />}
                  {selectedStatus === "pending" && <Clock className="h-3 w-3" />}
                  {selectedStatus === "failed" && <XCircle className="h-3 w-3" />}
                  {selectedStatus}
                </Badge>
              )}
              {selectedAccount === "all" && selectedType === "all" && selectedStatus === "all" && (
                <span className="text-sm text-muted-foreground">No filters applied</span>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function BalancesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccount = selectedAccount === "all" || transaction.account === selectedAccount;
    const matchesType = selectedType === "all" || transaction.type === selectedType;
    const matchesStatus = selectedStatus === "all" || transaction.status === selectedStatus;
    
    return matchesSearch && matchesAccount && matchesType && matchesStatus;
  });

  const totalSpent = mockTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalContributed = mockTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Account Balances</h1>
          <p className="text-sm text-muted-foreground">Healthcare savings and transaction history</p>
        </div>
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <Download className="h-3 w-3" />
          Export
        </Button>
      </div>

      {/* Compact Account Balances Summary */}
      <CompactBalanceSummary 
        balances={{
          hsa: 1250,
          wsa: 3200,
          total: 4450
        }} 
      />

      {/* Healthcare Service Balances - Top Priority */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Healthcare Service Balances
          </CardTitle>
          <CardDescription>
            View your available balances for specific healthcare services with expiry and renewal information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HealthcareBalanceCarousel />
        </CardContent>
      </Card>


      {/* Summary Stats */}
      <Card>
        <CardContent className="p-3 md:p-4">
          <div className="space-y-3">
            {/* Total Spent */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowDown className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-muted-foreground">Total Spent</span>
              </div>
              <span className="text-lg font-bold text-red-600">${totalSpent.toFixed(2)}</span>
            </div>
            
            {/* Total Contributed */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-muted-foreground">Total Contributed</span>
              </div>
              <span className="text-lg font-bold text-green-600">${totalContributed.toFixed(2)}</span>
            </div>
            
            {/* Transactions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-muted-foreground">Transactions</span>
              </div>
              <span className="text-lg font-bold">{mockTransactions.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <CardDescription>
            View and filter your healthcare account transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <FilterDrawer
                selectedAccount={selectedAccount}
                setSelectedAccount={setSelectedAccount}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
              />
            </div>
            
            {/* Desktop Filters */}
            <div className="hidden sm:grid grid-cols-3 gap-3">
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  <SelectItem value="HSA">HSA</SelectItem>
                  <SelectItem value="WSA">WSA</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                  <SelectItem value="contribution">Contribution</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Transaction List */}
          <div className="space-y-3 overflow-hidden">
            {filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3 sm:gap-0"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="p-2 rounded-full bg-muted flex-shrink-0">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{transaction.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="hidden sm:inline">•</span>
                        <span>{transaction.category}</span>
                        <span className="hidden sm:inline">•</span>
                        <Badge variant="secondary" className="text-xs">
                          {transaction.account}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:flex-shrink-0">
                  <Badge className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                  <div className="text-right">
                    <p className={`font-bold text-sm sm:text-base ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No transactions found matching your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
