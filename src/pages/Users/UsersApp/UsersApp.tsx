"use client";

import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { useUserColumns } from "./userTable/userTable";
import { usersData } from "./data/usersData";
import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


export default function UsersPage() {
  const { userColumns, users } = useUserColumns(usersData);
  const [dateFilter, setDateFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [allFilter, setAllFilter] = useState('');
  const handleResetFilter = () => {
    setDateFilter('');
    setActiveFilter('');
    setAllFilter('');
  };


  return (
    <div className="sm:p-6">
      <div className="w-full mx-auto space-y-4 mb-6">
        {/* Header Section */}
        <div className="py-2">
          <h1 className="text-black text-2xl font-bold">User's- App</h1>
        </div>

        {/* Category List Section */}
        <div className="bg-white sm:py-3">
          <div className="flex items-center gap-2">
            <span className="text-[#6B6B6B] text-xl font-semibold">Category List</span>
            <span className="bg-secondary text-gray-700 px-3 py-2 rounded-full text-base font-medium border border-[#969696]">
              10
            </span>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter By Button */}
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-300"
            >
              <Filter className="h-4 w-4" />
              <span>Filter By</span>
            </Button>

            {/* Date Dropdown */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last7days">Last 7 Days</SelectItem>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
                <SelectItem value="thismonth">This Month</SelectItem>
              </SelectContent>
            </Select>

            {/* Active Dropdown */}
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Active" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* All Dropdown */}
            <Select value={allFilter} onValueChange={setAllFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset Filter Button */}
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 "
              onClick={handleResetFilter}
            >
              <X className="h-4 w-4" />
              <span>Reset Filter</span>
            </Button>
          </div>
        </div>
      </div>

      <CustomTable columns={userColumns} data={users} />
    </div>
  );
}