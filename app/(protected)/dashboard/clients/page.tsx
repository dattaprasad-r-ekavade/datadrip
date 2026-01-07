"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";
import { ClientForm } from "@/components/forms/client-form";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  name: string;
  createdAt: string;
  metaAccount?: { id: string; accountId: string };
  googleAccount?: { id: string; customerId: string };
  _count: {
    reports: number;
    insights: number;
  };
}

interface ClientsResponse {
  clients: Client[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  const fetchClients = useCallback(async (page = 1, searchTerm = "") => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/clients?${new URLSearchParams({
          page: page.toString(),
          limit: "10",
          ...(searchTerm && { search: searchTerm }),
        })}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }

      const data: ClientsResponse = await response.json();
      setClients(data.clients);
      setPagination(data.pagination);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load clients.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchClients(1, search);
  }, [fetchClients, search]);

  const handleCreateClient = async (data: { name: string }) => {
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create client");
      }

      toast({
        title: "Success",
        description: "Client created successfully.",
      });

      setShowCreateForm(false);
      fetchClients(pagination.page, search);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create client.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm("Are you sure you want to delete this client?")) {
      return;
    }

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete client");
      }

      toast({
        title: "Success",
        description: "Client deleted successfully.",
      });

      fetchClients(pagination.page, search);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete client.",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (page: number) => {
    fetchClients(page, search);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">
            Manage your agency's clients and their ad accounts.
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {showCreateForm && (
        <div className="mb-8">
          <ClientForm
            onSubmit={handleCreateClient}
            submitLabel="Create Client"
          />
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
          <CardDescription>
            A list of all clients in your agency.
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading clients...</div>
          ) : clients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {search ? "No clients found matching your search." : "No clients yet. Add your first client above."}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{client.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span>{client._count.reports} reports</span>
                        <span>{client._count.insights} insights</span>
                        {client.metaAccount && (
                          <span className="text-green-600">Meta connected</span>
                        )}
                        {client.googleAccount && (
                          <span className="text-blue-600">Google connected</span>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteClient(client.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}