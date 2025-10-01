import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

export interface Contact {
  _id?: string;
  ownerUserId: string;
  contactEmail: string;
  displayName: string;
  favorite?: boolean;
  hasAccount?: boolean;
  walletAddress?: string;
  source?: 'manual' | 'transaction' | 'imported';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateContactData {
  ownerUserId: string;
  contactEmail: string;
  displayName: string;
  hasAccount?: boolean;
  source?: 'manual' | 'transaction' | 'imported';
}

interface UseContactsReturn {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  searchResults: Contact[];
  isSearching: boolean;
  refreshContacts: () => Promise<void>;
  createContact: (contactData: Omit<CreateContactData, 'ownerUserId'>) => Promise<boolean>;
  updateContact: (contactEmail: string, updateData: Partial<Contact>) => Promise<boolean>;
  deleteContact: (contactEmail: string) => Promise<boolean>;
  toggleFavorite: (contactEmail: string) => Promise<boolean>;
  searchContacts: (query: string) => Promise<void>;
  clearSearch: () => void;
}

export function useContacts(ownerUserId: string | null): UseContactsReturn {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Contact[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchContacts = useCallback(async (query?: string) => {
    if (!ownerUserId) return;

    try {
      setIsLoading(!query);
      setIsSearching(!!query);
      setError(null);

      const params = new URLSearchParams({ ownerUserId });
      if (query) {
        params.set('query', query);
      }

      const response = await api.get(`/api/contacts?${params.toString()}`);
      const contactsData = response.data?.contacts || [];
      
      if (query) {
        setSearchResults(contactsData);
      } else {
        setContacts(contactsData);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Error fetching contacts:', err);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [ownerUserId]);

  const refreshContacts = useCallback(async () => {
    await fetchContacts();
  }, [fetchContacts]);

  const createContact = useCallback(async (contactData: Omit<CreateContactData, 'ownerUserId'>): Promise<boolean> => {
    if (!ownerUserId) return false;

    try {
      const response = await api.post('/api/contacts', {
        ...contactData,
        ownerUserId
      });

      setContacts(prev => [response.data.contact, ...prev]);
      return true;
    } catch (err) {
      console.error('Error creating contact:', err);
      setError(err instanceof Error ? err.message : 'Failed to create contact');
      return false;
    }
  }, [ownerUserId]);

  const updateContact = useCallback(async (contactEmail: string, updateData: Partial<Contact>): Promise<boolean> => {
    if (!ownerUserId) return false;

    try {
      const response = await api.put('/api/contacts', {
        ownerUserId,
        contactEmail,
        ...updateData
      });

      setContacts(prev => prev.map(c => 
        c.contactEmail === contactEmail ? response.data.contact : c
      ));
      return true;
    } catch (err) {
      console.error('Error updating contact:', err);
      setError(err instanceof Error ? err.message : 'Failed to update contact');
      return false;
    }
  }, [ownerUserId]);

  const deleteContact = useCallback(async (contactEmail: string): Promise<boolean> => {
    if (!ownerUserId) return false;

    try {
      await api.delete(`/api/contacts?ownerUserId=${encodeURIComponent(ownerUserId)}&contactEmail=${encodeURIComponent(contactEmail)}`);
      setContacts(prev => prev.filter(c => c.contactEmail !== contactEmail));
      return true;
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete contact');
      return false;
    }
  }, [ownerUserId]);

  const toggleFavorite = useCallback(async (contactEmail: string): Promise<boolean> => {
    const contact = contacts.find(c => c.contactEmail === contactEmail);
    if (!contact) return false;
    
    return updateContact(contactEmail, { favorite: !contact.favorite });
  }, [contacts, updateContact]);

  const searchContacts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    await fetchContacts(query);
  }, [fetchContacts]);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
  }, []);

  useEffect(() => {
    if (ownerUserId) {
      fetchContacts();
    }
  }, [ownerUserId, fetchContacts]);

  return {
    contacts,
    isLoading,
    error,
    searchResults,
    isSearching,
    refreshContacts,
    createContact,
    updateContact,
    deleteContact,
    toggleFavorite,
    searchContacts,
    clearSearch
  };
}
