"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ClinicCardSkeleton, ClinicsSearchSkeleton } from "@/components/ui/skeletons";
import { useDirectoryStore } from "@twinn/store";
import { motion } from "framer-motion";
import {
  Building2,
  Clock,
  Filter,
  MapPin,
  Navigation,
  Phone,
  Search,
  Shield,
  Star
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function ClinicsPage() {
  const { clinics, searchClinics } = useDirectoryStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("distance");
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock clinics data with images
  const mockClinics = [
    {
      id: '1',
      name: 'City Health Center',
      address: '123 Main St, Toronto, ON',
      distance: 1.2,
      rating: 4.8,
      phone: '(555) 123-4567',
      image: 'https://images.unsplash.com/photo-1631507623112-0092cef9c70d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      services: ['Primary Care', 'Urgent Care', 'Physical Therapy'],
      hours: 'Mon-Fri: 8AM-6PM',
      insuranceAccepted: ['Aetna', 'Blue Cross', 'Cigna'],
    },
    {
      id: '2',
      name: 'Family Wellness Clinic',
      address: '456 Oak Ave, Ottawa, ON',
      distance: 2.5,
      rating: 4.5,
      phone: '(555) 234-5678',
      image: 'https://images.unsplash.com/photo-1642844613096-7b743b7d9915?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      services: ['Family Medicine', 'Pediatrics', 'Mental Health'],
      hours: 'Mon-Fri: 7AM-7PM',
      insuranceAccepted: ['Aetna', 'UnitedHealthcare', 'Medicare'],
    },
    {
      id: '3',
      name: 'Community Medical Group',
      address: '789 Pine Ln, Hamilton, ON',
      distance: 3.1,
      rating: 4.2,
      phone: '(555) 345-6789',
      image: 'https://images.unsplash.com/photo-1669930605340-801a0be1f5a3?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      services: ['Internal Medicine', 'Cardiology', 'Dermatology'],
      hours: 'Mon-Fri: 9AM-5PM',
      insuranceAccepted: ['Blue Cross', 'Cigna', 'Aetna'],
    },
    {
      id: '4',
      name: 'Downtown Medical Center',
      address: '321 Business Blvd, London, ON',
      distance: 0.8,
      rating: 4.7,
      phone: '(555) 456-7890',
      image: 'https://plus.unsplash.com/premium_photo-1753267731393-dd5785991e5c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      services: ['Primary Care', 'Specialists', 'Lab Services'],
      hours: 'Mon-Fri: 8AM-8PM, Sat: 9AM-3PM',
      insuranceAccepted: ['Aetna', 'Blue Cross', 'UnitedHealthcare'],
    },
    {
      id: '5',
      name: 'Kitchener Health Hub',
      address: '567 Queen St, Kitchener, ON',
      distance: 4.2,
      rating: 4.6,
      phone: '(555) 567-8901',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      services: ['Urgent Care', 'Pediatrics', 'Mental Health'],
      hours: 'Mon-Fri: 7AM-9PM, Sat-Sun: 8AM-6PM',
      insuranceAccepted: ['Blue Cross', 'Cigna', 'Medicare'],
    },
    {
      id: '6',
      name: 'Windsor Medical Plaza',
      address: '890 Riverside Dr, Windsor, ON',
      distance: 5.8,
      rating: 4.3,
      phone: '(555) 678-9012',
      image: 'https://images.unsplash.com/photo-1669930605340-801a0be1f5a3?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      services: ['Family Medicine', 'Cardiology', 'Physical Therapy'],
      hours: 'Mon-Fri: 8AM-6PM',
      insuranceAccepted: ['Aetna', 'UnitedHealthcare', 'Blue Cross'],
    },
  ];
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);

  const filterOptions = [
    { id: "all", label: "All Services" },
    { id: "primary", label: "Primary Care" },
    { id: "urgent", label: "Urgent Care" },
    { id: "specialists", label: "Specialists" },
    { id: "mental", label: "Mental Health" },
  ];

  const sortOptions = [
    { id: "distance", label: "Distance" },
    { id: "rating", label: "Rating" },
    { id: "name", label: "Name" },
  ];

  // Filter and sort clinics
  const filteredClinics = useMemo(() => {
    let filtered = mockClinics.filter((clinic) => {
      const matchesSearch = searchQuery === "" || 
        clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.services?.some(service => 
          service.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesFilter = selectedFilter === "all" || 
        clinic.services?.some(service => 
          service.toLowerCase().includes(selectedFilter)
        );

      return matchesSearch && matchesFilter;
    });

    // Sort clinics
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return (a.distance || 0) - (b.distance || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedFilter, sortBy]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <ClinicsSearchSkeleton />
          <div className="space-y-4 mt-6">
            {[...Array(4)].map((_, i) => (
              <ClinicCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div className="mb-6" variants={itemVariants}>
          <h1 className="text-2xl font-bold text-foreground mb-2">Find Clinics</h1>
          <p className="text-muted-foreground">
            Discover healthcare providers near you in Ontario
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div className="relative mb-6" variants={itemVariants}>
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder="Search clinics, services, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-base border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </motion.div>

        {/* Filters and Sort */}
        <motion.div className="mb-6" variants={itemVariants}>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 flex-1">
              {filterOptions.map((option) => (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={selectedFilter === option.id ? "default" : "outline"}
                    onClick={() => setSelectedFilter(option.id)}
                    size="sm"
                    className="rounded-lg"
                  >
                    {option.label}
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    Sort by {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Header */}
        <motion.div className="mb-6" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {filteredClinics.length} Clinics Found
            </h2>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Navigation className="h-4 w-4" />
              <span>Sorted by {sortOptions.find(opt => opt.id === sortBy)?.label}</span>
            </div>
          </div>
        </motion.div>

        {/* Clinic Cards */}
        <motion.div className="space-y-4" variants={containerVariants}>
          {filteredClinics.map((clinic, index) => (
            <motion.div
              key={clinic.id}
              variants={cardVariants}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link href={`/clinics/${clinic.id}`}>
                <Card className="border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-card cursor-pointer">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Clinic Image */}
                    <div className="w-full sm:w-32 h-48 sm:h-auto relative flex-shrink-0">
                      <Image
                        src={clinic.image}
                        alt={clinic.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 128px"
                        priority={index < 2}
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-primary/90 text-primary-foreground border-0">
                          {clinic.distance ? `${clinic.distance.toFixed(1)} km` : "Nearby"}
                        </Badge>
                      </div>
                    </div>

                    {/* Clinic Info */}
                    <div className="flex-1 p-4 sm:p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {clinic.name}
                        </h3>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="text-sm">{clinic.address}</span>
                          </div>
                          
                          {clinic.phone && (
                            <div className="flex items-center text-muted-foreground">
                              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="text-sm">{clinic.phone}</span>
                            </div>
                          )}
                          
                          {clinic.hours && (
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="text-sm">{clinic.hours}</span>
                            </div>
                          )}
                        </div>

                        {/* Rating */}
                        {clinic.rating && (
                          <div className="flex items-center mb-4">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(clinic.rating || 0)
                                      ? "text-yellow-400 fill-current"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm font-medium text-foreground">
                              {clinic.rating?.toFixed(1)}
                            </span>
                          </div>
                        )}

                        {/* Services */}
                        {clinic.services && clinic.services.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {clinic.services.slice(0, 3).map((service) => (
                                <Badge
                                  key={service}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {service}
                                </Badge>
                              ))}
                              {clinic.services.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{clinic.services.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Insurance */}
                        {clinic.insuranceAccepted && clinic.insuranceAccepted.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center mb-2">
                              <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-sm font-medium text-foreground">
                                Insurance Accepted
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {clinic.insuranceAccepted.slice(0, 3).map((insurance) => (
                                <Badge
                                  key={insurance}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {insurance}
                                </Badge>
                              ))}
                              {clinic.insuranceAccepted.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{clinic.insuranceAccepted.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <Button className="w-full sm:w-auto">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        {filteredClinics.length > 0 && (
          <motion.div 
            className="text-center mt-8"
            variants={itemVariants}
          >
            <Button variant="outline" size="lg">
              Load More Clinics
            </Button>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredClinics.length === 0 && (
          <motion.div 
            className="text-center py-12"
            variants={itemVariants}
          >
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No clinics found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters to find more clinics.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}