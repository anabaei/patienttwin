"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ClinicCardSkeleton, ClinicsSearchSkeleton } from "@/components/ui/skeletons";
import { cn } from "@/lib/utils";
import { useDirectoryStore } from "@twinn/store";
import { motion, Variants } from "framer-motion";
import {
  Building2,
  Clock,
  Filter,
  MapPin,
  Navigation,
  Phone,
  Search,
  Shield,
  Star,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function ClinicsPage() {
  const { clinics, servicesByClinic, fetchDirectory, isLoading: isDirectoryLoading } = useDirectoryStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("distance");
  const [maxDistance, setMaxDistance] = useState(50);
  const [selectedInsurance, setSelectedInsurance] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  useEffect(() => {
    void fetchDirectory();
  }, [fetchDirectory]);

  // Transform store data to match UI requirements
  const clinicsWithServices = clinics.map(clinic => {
    const services = servicesByClinic[clinic.id] || [];
    const serviceNames = services.map(service => service.name);
    
    // Mock additional data for UI
    const mockImages = [
      'https://images.unsplash.com/photo-1631507623112-0092cef9c70d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1642844613096-7b743b7d9915?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1669930605340-801a0be1f5a3?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1753267731393-dd5785991e5c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1669930605340-801a0be1f5a3?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ];
    
    return {
      id: clinic.id,
      name: clinic.name,
      address: clinic.address,
      distance: clinic.latitude && clinic.longitude ? 
        Math.round((Math.random() * 5 + 0.5) * 10) / 10 : 0, // Mock distance
      rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // Mock rating 3.5-5.0
      phone: clinic.phone,
      image: mockImages[Math.floor(Math.random() * mockImages.length)],
      services: serviceNames,
      hours: 'Mon-Fri: 8AM-6PM', // Mock hours
      insuranceAccepted: ['Sun Life', 'Green Shield Canada', 'Manulife'], // Mock insurance
    };
  });
  
  // Simulate data loading
  useEffect(() => {
    if (isDirectoryLoading) {
      setIsLoading(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 450);

    return () => window.clearTimeout(timer);
  }, [isDirectoryLoading]);

  const serviceOptions: MultiSelectOption[] = [
    { value: "massage", label: "Massage Therapy" },
    { value: "chiropractic", label: "Chiropractic Care" },
    { value: "physiotherapy", label: "Physiotherapy" },
    { value: "psychology", label: "Psychology & Social Work" },
    { value: "acupuncture", label: "Acupuncture" },
    { value: "dietician", label: "Dietician Services" },
    { value: "audiologist", label: "Audiologist Services" },
    { value: "occupational", label: "Occupational Therapy" },
    { value: "osteopathy", label: "Osteopathy" },
    { value: "podiatry", label: "Podiatry" },
    { value: "speech", label: "Speech Therapy" },
    { value: "naturopathy", label: "Naturopathy" },
  ];

  const sortOptions = [
    { id: "distance", label: "Distance" },
    { id: "rating", label: "Rating" },
    { id: "name", label: "Name" },
  ];

  const insuranceOptions = [
    { id: "all", label: "All Insurance" },
    { id: "sun-life", label: "Sun Life" },
    { id: "green-shield", label: "Green Shield Canada" },
    { id: "manulife", label: "Manulife" },
    { id: "blue-cross", label: "Blue Cross" },
  ];

  const distanceOptions = [
    { id: 10, label: "Within 10 km" },
    { id: 25, label: "Within 25 km" },
    { id: 50, label: "Within 50 km" },
    { id: 100, label: "Within 100 km" },
  ];

  // Filter and sort clinics
  const filteredClinics = useMemo(() => {
    const filtered = clinicsWithServices.filter((clinic) => {
      const matchesSearch = searchQuery === "" || 
        clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.services?.some(service => 
          service.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesServiceFilter = selectedServices.length === 0 || 
        selectedServices.some(selectedService => 
          clinic.services?.some(service => 
            service.toLowerCase().includes(selectedService.toLowerCase())
          )
        );

      const matchesDistanceFilter = clinic.distance <= maxDistance;

      const matchesInsuranceFilter = selectedInsurance === "all" || 
        clinic.insuranceAccepted?.some(insurance => 
          insurance.toLowerCase().includes(selectedInsurance.toLowerCase())
        );

      return matchesSearch && matchesServiceFilter && matchesDistanceFilter && matchesInsuranceFilter;
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
  }, [clinicsWithServices, searchQuery, selectedServices, maxDistance, selectedInsurance, sortBy]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
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

  const cardVariants: Variants = {
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
          <h1 className="text-2xl font-bold text-foreground mb-2">Find Paramedical Clinics</h1>
          <p className="text-muted-foreground">
            Discover paramedical service providers near you in Ontario
          </p>
        </motion.div>

        {/* Search Bar and Filter Button */}
        <motion.div className="mb-6" variants={itemVariants}>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search paramedical clinics, services, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            {/* Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`h-12 w-12 shrink-0 relative ${
                    (selectedServices.length > 0 || maxDistance !== 50 || selectedInsurance !== "all") 
                      ? "border-primary bg-primary/5" 
                      : ""
                  }`}
                >
                  <Filter className="h-5 w-5" />
                  {(selectedServices.length > 0 || maxDistance !== 50 || selectedInsurance !== "all") && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {(selectedServices.length > 0 ? 1 : 0) + (maxDistance !== 50 ? 1 : 0) + (selectedInsurance !== "all" ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="bottom" 
                className={cn(
                  "h-[88vh] max-h-[calc(100vh-4rem)] w-full gap-0 rounded-t-3xl border-t border-border p-0"
                )}
              >
                <div className="flex h-full flex-col">
                  <SheetHeader className="border-b border-border px-6 pb-4 pt-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Filter className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col">
                        <SheetTitle className="text-base font-semibold">Filter Clinics</SheetTitle>
                        <SheetDescription className="text-xs text-muted-foreground">
                          Refine your search by service type, distance, and insurance
                        </SheetDescription>
                      </div>
                    </div>
                  </SheetHeader>
                  
                  <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto px-6 py-5 space-y-6">
                      {/* Service Type Multi-Select */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Service Type
                        </h3>
                        <MultiSelect
                          options={serviceOptions}
                          selected={selectedServices}
                          onChange={setSelectedServices}
                          placeholder="Select services..."
                          className="w-full"
                        />
                      </div>

                      {/* Distance and Insurance Filters */}
                      <div className="grid grid-cols-1 gap-6">
                        {/* Distance Filter */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Distance
                          </h3>
                          <Select value={maxDistance.toString()} onValueChange={(value) => setMaxDistance(Number(value))}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select distance" />
                            </SelectTrigger>
                            <SelectContent>
                              {distanceOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id.toString()}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Insurance Filter */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Insurance Accepted
                          </h3>
                          <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select insurance" />
                            </SelectTrigger>
                            <SelectContent>
                              {insuranceOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Sort Options */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          Sort by
                        </h3>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {sortOptions.map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                    </div>
                  </div>
                  
                  {/* Fixed Footer */}
                  <div className="border-t bg-background px-6 py-4">
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedServices([]);
                          setMaxDistance(50);
                          setSelectedInsurance("all");
                          setSortBy("distance");
                        }}
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear All Filters
                      </Button>
                      <Button
                        onClick={() => setIsFilterOpen(false)}
                        className="flex-1"
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </motion.div>



        {/* Results Header */}
        <motion.div className="mb-6" variants={itemVariants}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {filteredClinics.length} Clinics Found
              </h2>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Navigation className="h-4 w-4" />
                <span>Sorted by {sortOptions.find(opt => opt.id === sortBy)?.label}</span>
              </div>
            </div>
            
            {/* Active Filters Summary */}
            {(selectedServices.length > 0 || maxDistance !== 50 || selectedInsurance !== "all") && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Filters applied:</span>
                  <div className="flex flex-wrap gap-1">
                    {maxDistance !== 50 && (
                      <Badge variant="secondary" className="text-xs">
                        {maxDistance}km
                      </Badge>
                    )}
                    {selectedInsurance !== "all" && (
                      <Badge variant="secondary" className="text-xs">
                        {insuranceOptions.find(opt => opt.id === selectedInsurance)?.label}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedServices([]);
                      setMaxDistance(50);
                      setSelectedInsurance("all");
                      setSortBy("distance");
                    }}
                    className="text-xs h-6 px-2"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear All
                  </Button>
                </div>
                
                {/* Selected Services Chips */}
                {selectedServices.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedServices.map((service) => {
                      const serviceOption = serviceOptions.find(opt => opt.value === service);
                      return (
                        <Badge
                          key={service}
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          onClick={() => {
                            setSelectedServices(prev => prev.filter(s => s !== service));
                          }}
                        >
                          {serviceOption?.label}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
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
                setSelectedServices([]);
                setMaxDistance(50);
                setSelectedInsurance("all");
                setSortBy("distance");
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
