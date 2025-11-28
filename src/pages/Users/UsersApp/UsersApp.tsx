"use client";

import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { useUserColumns } from "./userTable/userTable";
import { usersData } from "./data/usersData";
import { useState } from 'react';
import { Filter, Repeat } from 'lucide-react';
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
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">
        {/* Header Section */}
        <div className="pt-2 sm:py-2">
          <h1 className="text-black text-2xl font-bold">User's- App</h1>
        </div>

        {/* Category List Section */}
        <div className="sm:py-3">
          <div className="flex items-center gap-2">
            <span className="text-[#6B6B6B] text-xl font-semibold">Category List</span>
            <span className="bg-secondary text-gray-700 px-3 py-2 rounded-full text-base font-medium border border-[#969696]">
              10
            </span>
          </div>
        </div>

        {/* Filter Section */}
        <div className="w-full bg-white rounded-md px-4 py-2">
          <div className="flex flex-wrap items-center gap-3">

            {/* Filter By */}
            <div className="flex items-center gap-2 px-4 py-2 border border-yellow-400 rounded-md 
                    w-full sm:w-[48%] md:w-auto">
              <Filter className="h-4 w-4" />
              <span className="text-sm py-2 font-medium">Filter By</span>
            </div>

            {/* Date Dropdown */}
            <div className="px-4 py-2 border border-yellow-400 rounded-md 
                    w-full sm:w-[48%] md:w-auto">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full md:w-[130px] border-none shadow-none px-0">
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
            </div>

            {/* Active Dropdown */}
            <div className="px-4 py-2 border border-yellow-400 rounded-md 
                    w-full sm:w-[48%] md:w-auto">
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-full md:w-[130px] border-none shadow-none px-0">
                  <SelectValue placeholder="Active" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* All Dropdown */}
            <div className="px-4 py-2 border border-yellow-400 rounded-md 
                    w-full sm:w-[48%] md:w-auto">
              <Select value={allFilter} onValueChange={setAllFilter}>
                <SelectTrigger className="w-full md:w-[130px] border-none shadow-none px-0">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reset Button */}
            <div className="px-4 py-2 border border-yellow-400 rounded-md w-full md:flex-1">
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-600 hover:bg-white flex items-center gap-2 w-full justify-start"
                onClick={handleResetFilter}
              >
                <Repeat className="h-4 w-4" />
                Reset Filter
              </Button>
            </div>

          </div>
        </div>


      </div>

      <CustomTable columns={userColumns} data={users} />

      <div className="flex justify-center my-6">
        <button
          className="px-3 sm:px-6 py-3 bg-yellow-400 cursor-pointer sm:font-bold hover:bg-yellow-500 text-black rounded transition-colors"
        >
          Add new user
        </button>
      </div>
    </div>
  );
}