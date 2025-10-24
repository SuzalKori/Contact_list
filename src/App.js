import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, UserPlus, Mail, Phone, MapPin, X, User, Building, Loader2, Trash2, AlertTriangle, Sun, Moon, Plus, Minus, UserCheck, ArrowLeft, Edit } from 'lucide-react';

// --- DATA STRUCTURE UPDATE ---
// phone is now an array of strings called 'phoneNumbers'
const INITIAL_CONTACTS = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav.sharma@example.in",
    phoneNumbers: ["+91 98765 43210 (Mobile)", "+91 80 1234 5678 (Work)"],
    company: "InfoSys Solutions",
    location: "Bengaluru, KA",
    avatar: "AS",
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya.patel@example.in",
    phoneNumbers: ["+91 99000 11223 (Personal)"],
    company: "Digital Marketing Co.",
    location: "Mumbai, MH",
    avatar: "PP",
  },
  {
    id: 3,
    name: "Rohan Varma",
    email: "rohan.varma@example.in",
    phoneNumbers: ["+91 88888 77777 (Mobile)", "+91 22 2345 6789 (Office)"],
    company: "Creative Studios",
    location: "New Delhi, DL",
    avatar: "RV",
  },
  {
    id: 4,
    name: "Ananya Desai",
    email: "ananya.desai@example.in",
    phoneNumbers: ["+91 76543 21098"],
    company: "Future Labs",
    location: "Pune, MH",
    avatar: "AD",
  },
  {
    id: 5,
    name: "Vikram Singh",
    email: "vikram.singh@example.in",
    phoneNumbers: ["+91 95123 45678 (Primary)"],
    company: "Tech Ventures",
    location: "Hyderabad, TS",
    avatar: "VS",
  },
  {
    id: 6,
    name: "Sneha Iyer",
    email: "sneha.iyer@example.in",
    phoneNumbers: ["+91 94444 55555"],
    company: "Consulting Group",
    location: "Chennai, TN",
    avatar: "SI",
  },
  {
    id: 7,
    name: "Kunal Jha",
    email: "kunal.jha@example.in",
    phoneNumbers: ["+91 70000 10001 (Home)"],
    company: "Manufacturing Pvt Ltd",
    location: "Kolkata, WB",
    avatar: "KJ",
  },
  {
    id: 8,
    name: "Deepika Reddy",
    email: "deepika.reddy@example.in",
    phoneNumbers: ["+91 92222 33445 (Work)"],
    company: "Financial Services",
    location: "Ahmedabad, GJ",
    avatar: "DR",
  },
];

// Generate avatar colors based on name
const getAvatarColor = (name) => {
  const colors = [
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-600',
    'from-rose-500 to-red-600',
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-purple-600',
    'from-green-500 to-emerald-600'
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const ContactListApp = () => {
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Deletion Confirmation States
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [isPhoneConfirmOpen, setIsPhoneConfirmOpen] = useState(false);
  const [phoneToDeleteInfo, setPhoneToDeleteInfo] = useState(null);
  const [phoneToDeleteNumber, setPhoneToDeleteNumber] = useState('');
  
  // Data State
  const [selectedContact, setSelectedContact] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(''); 
  
  // Form State
  const [contactFormState, setContactFormState] = useState({
    id: null,
    name: '',
    email: '',
    phoneNumbers: [''], 
    company: '',
    location: ''
  });
  
  // --- THEME LOGIC ---
  const [theme, setTheme] = useState('light');
  const isDark = theme === 'dark';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [isDark]);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };
  
  // Theme-aware Tailwind Class Mappings
  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const textPrimary = isDark ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-700';
  const headerBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const cardBg = isDark ? 'bg-gray-800 ring-gray-700' : 'bg-white ring-gray-100';
  const searchBg = isDark ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500';
  const modalBg = isDark ? 'bg-gray-800' : 'bg-white';
  const modalHeaderBg = isDark ? 'bg-gray-700 border-gray-700' : 'bg-gray-50 border-gray-100';

  // Common input styling function
  const getInputClasses = useCallback((hasIcon = false) => 
    `w-full ${hasIcon ? 'pl-10' : 'pl-4'} pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`, [isDark]);

  // Filter contacts based on search query
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    
    const query = searchQuery.toLowerCase();
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(query) ||
      contact.phoneNumbers.some(p => p.toLowerCase().includes(query))
    );
  }, [contacts, searchQuery]);
  
  // Find the name of the contact being deleted
  const contactName = useMemo(() => {
    if (!contactToDelete) return '';
    const contact = contacts.find(c => c.id === contactToDelete);
    return contact ? contact.name : 'this contact';
  }, [contacts, contactToDelete]);

  // --- CONTACT DETAIL HANDLERS ---
  const handleOpenDetailModal = (contact) => {
    setSelectedContact(contact);
    setIsDetailModalOpen(true);
  };
  
  const handleCloseDetailModal = () => {
    setSelectedContact(null);
    setIsDetailModalOpen(false);
  };
  
  // --- EDIT HANDLERS ---
  const handleOpenEditModal = (contact) => {
    setContactFormState({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phoneNumbers: [...contact.phoneNumbers],
      company: contact.company,
      location: contact.location,
    });
    handleCloseDetailModal();
    setIsEditModalOpen(true);
  };
  
  // Helper to reset the form state
  const resetFormState = () => {
    setContactFormState({
      id: null,
      name: '',
      email: '',
      phoneNumbers: [''],
      company: '',
      location: ''
    });
    setError('');
    setIsLoading(false);
  };

  // --- PHONE NUMBER DELETION HANDLERS ---
  const handleDeletePhoneNumberInitiate = (contactId, phoneIndex) => {
    const contactToUpdate = contacts.find(c => c.id === contactId);
    if (!contactToUpdate) return;
    
    if (contactToUpdate.phoneNumbers.length <= 1) {
      setError('A contact must have at least one phone number. Use the main trash icon to delete the entire contact.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    setPhoneToDeleteInfo({ contactId, phoneIndex });
    setPhoneToDeleteNumber(contactToUpdate.phoneNumbers[phoneIndex]);
    setIsPhoneConfirmOpen(true);
    setError(''); 
  };

  const handleDeletePhoneNumber = () => {
    if (!phoneToDeleteInfo) return;
    const { contactId, phoneIndex } = phoneToDeleteInfo;
    
    setIsLoading(true);

    setTimeout(() => {
      const contactIndex = contacts.findIndex(c => c.id === contactId);
      if (contactIndex === -1) {
          setIsLoading(false);
          return;
      }
      
      const contactToUpdate = contacts[contactIndex];
      const newPhoneNumbers = contactToUpdate.phoneNumbers.filter((_, index) => index !== phoneIndex);
      const updatedContact = { ...contactToUpdate, phoneNumbers: newPhoneNumbers };
      
      setContacts(prevContacts => prevContacts.map(c => 
        c.id === contactId ? updatedContact : c
      ));
      
      setSelectedContact(updatedContact);
      setIsLoading(false);
      setIsPhoneConfirmOpen(false);
      setPhoneToDeleteInfo(null);
      setPhoneToDeleteNumber('');
    }, 500);
  };

  const handleCancelPhoneDelete = () => {
    setIsPhoneConfirmOpen(false);
    setPhoneToDeleteInfo(null);
    setPhoneToDeleteNumber('');
  };

  // --- FULL CONTACT DELETION HANDLERS ---
  const handleDeleteInitiate = (id) => {
    setContactToDelete(id);
    setIsConfirmModalOpen(true);
    if (isDetailModalOpen) handleCloseDetailModal();
  };

  const handleDeleteContact = () => {
    const id = contactToDelete;
    if (!id) return;
    
    setIsLoading(true);

    setTimeout(() => {
        setContacts(contacts.filter(contact => contact.id !== id));
        setIsLoading(false);
        setIsConfirmModalOpen(false);
        setContactToDelete(null);
        setSelectedContact(null);
    }, 500); 
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setContactToDelete(null);
  };

  // --- ADD/EDIT/MERGE LOGIC ---
  const handleSaveOrUpdateContact = () => {
    setError('');

    const isEditing = !!contactFormState.id;
    const name = contactFormState.name.trim();
    const phoneNumbers = contactFormState.phoneNumbers.map(p => p.trim()).filter(p => p !== '');

    if (!name || phoneNumbers.length === 0) {
      setError('Name and at least one Phone number are required.');
      return;
    }

    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/;
    for (const phone of phoneNumbers) {
      if (!phoneRegex.test(phone)) {
        setError(`Please enter a valid phone number format for: ${phone}`);
        return;
      }
    }

    if (contactFormState.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactFormState.email.trim())) {
        setError('Please enter a valid email address.');
        return;
      }
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const existingContactIndex = contacts.findIndex(
        c => c.name.toLowerCase() === name.toLowerCase() && c.id !== contactFormState.id
      );

      if (isEditing) {
        const updatedContact = {
          ...contactFormState,
          name: name,
          phoneNumbers: phoneNumbers,
          email: contactFormState.email.trim(),
          company: contactFormState.company.trim(),
          location: contactFormState.location.trim(),
          avatar: name.split(/\s+/).map(n => n.charAt(0)).join('').toUpperCase() || name.charAt(0).toUpperCase(),
        };

        setContacts(prevContacts => prevContacts.map(c => 
          c.id === updatedContact.id ? updatedContact : c
        ));
        
        setSelectedContact(updatedContact);
        setIsEditModalOpen(false);

      } else if (existingContactIndex !== -1) {
        const existingContact = contacts[existingContactIndex];
        
        const existingPhonesSet = new Set(existingContact.phoneNumbers.map(p => p.toLowerCase()));
        const uniqueNewPhones = phoneNumbers.filter(
          newPhone => !existingPhonesSet.has(newPhone.toLowerCase())
        );

        const updatedContact = {
          ...existingContact,
          phoneNumbers: [...existingContact.phoneNumbers, ...uniqueNewPhones],
          email: contactFormState.email.trim() || existingContact.email,
          company: contactFormState.company.trim() || existingContact.company,
          location: contactFormState.location.trim() || existingContact.location,
        };

        const updatedContacts = [...contacts];
        updatedContacts[existingContactIndex] = updatedContact;
        setContacts(updatedContacts);

      } else {
        const initials = name.split(/\s+/).map(n => n.charAt(0)).join('').toUpperCase();

        const contact = {
          id: Date.now(),
          name: name,
          email: contactFormState.email.trim(),
          phoneNumbers: phoneNumbers,
          company: contactFormState.company.trim(),
          location: contactFormState.location.trim(),
          avatar: initials || name.charAt(0).toUpperCase()
        };
        
        setContacts([contact, ...contacts]);
      }

      resetFormState();
      setIsAddModalOpen(false);
      setIsLoading(false);
      setError('');

    }, 500);
  };
  
  // --- PHONE NUMBER INPUT HANDLERS ---
  const handleAddPhoneNumberField = () => {
    setContactFormState(prev => ({
      ...prev,
      phoneNumbers: [...prev.phoneNumbers, '']
    }));
  };

  const handleRemovePhoneNumberField = (index) => {
    if (contactFormState.phoneNumbers.length <= 1) return;
    setContactFormState(prev => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.filter((_, i) => i !== index)
    }));
  };

  const handlePhoneNumberChange = (index, value) => {
    setContactFormState(prev => {
      const newPhones = [...prev.phoneNumbers];
      newPhones[index] = value;
      return {
        ...prev,
        phoneNumbers: newPhones
      };
    });
  };
  
  const handleInputChange = (field, value) => {
    setContactFormState(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  return (
    <div className={`min-h-screen ${bgPrimary} ${textPrimary} transition-colors duration-300 font-sans`}>
      {/* Header */}
      <div className={`border-b sticky top-0 z-10 shadow-sm ${headerBg}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold">Contact List</h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredContacts.length} {filteredContacts.length === 1 ? 'contact' : 'contacts'} in directory
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                  onClick={toggleTheme}
                  className={`p-3 rounded-full ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'} transition-colors shadow-md`}
                  title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={() => { setIsAddModalOpen(true); resetFormState(); }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl active:scale-95 font-medium min-w-[150px]"
              >
                <UserPlus className="w-5 h-5" />
                Add Contact
              </button>
            </div>
            </div>
          
          <div className="relative mt-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search contacts by name or phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${searchBg}`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contact List Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredContacts.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl border border-gray-200 shadow-md ${cardBg}`}>
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${textPrimary}`}>No contacts found</h3>
            <p className="text-gray-400">
              {searchQuery.trim()
                ? `No contacts match your query: "${searchQuery}"`
                : "Add your first contact using the 'Add Contact' button."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleOpenDetailModal(contact)}
                className={`${cardBg} rounded-2xl p-6 shadow-xl ring-1 transition-all transform hover:scale-[1.02] hover:shadow-2xl relative cursor-pointer`}
              >
                <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteInitiate(contact.id); }}
                    disabled={isLoading}
                    className="absolute top-3 right-3 p-2 text-red-400 bg-red-50 rounded-full hover:bg-red-100 hover:text-red-600 transition-all disabled:opacity-50"
                    title="Delete Contact"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
                                
                <div className="flex items-start gap-4 mb-5">
                  <div className={`w-14 h-14 bg-gradient-to-br ${getAvatarColor(contact.name)} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0`}>
                    {contact.avatar}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h3 className={`font-extrabold text-xl truncate leading-tight ${textPrimary}`}>
                      {contact.name}
                    </h3>
                    {contact.company && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                        <Building className="w-3.5 h-3.5" /> {contact.company}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  {contact.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className={`font-medium truncate ${textSecondary}`}>
                        {contact.email}
                      </span>
                    </div>
                  )}
                  {contact.phoneNumbers.length > 0 && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className={`font-medium ${textSecondary}`}>
                        {contact.phoneNumbers[0]} {contact.phoneNumbers.length > 1 && `(+${contact.phoneNumbers.length - 1} more)`}
                      </span>
                    </div>
                  )}

                  {contact.location && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className={`font-medium truncate ${textSecondary}`}>{contact.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CONTACT DETAIL MODAL */}
      {isDetailModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleCloseDetailModal}>
          <div 
            className={`rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl ${modalBg}`} 
            onClick={(e) => e.stopPropagation()} 
          >
            <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'} sticky top-0 ${modalBg} z-10`}>
              <button
                onClick={handleCloseDetailModal}
                className={`text-gray-500 hover:text-gray-700 ${isDark ? 'dark:text-gray-400 dark:hover:text-gray-200' : ''} transition-colors p-1`}
                title="Back to list"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className={`text-2xl font-bold ${textPrimary} truncate px-4`}>{selectedContact.name}</h2>
              <div className='flex gap-2'>
                <button
                    onClick={() => handleOpenEditModal(selectedContact)}
                    className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                    title="Edit Contact"
                >
                    <Edit className="w-6 h-6" />
                </button>
                <button
                    onClick={() => handleDeleteInitiate(selectedContact.id)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    title="Delete Contact"
                >
                    <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className={`w-24 h-24 bg-gradient-to-br ${getAvatarColor(selectedContact.name)} rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-xl mb-4`}>
                  {selectedContact.avatar}
                </div>
                <h3 className={`font-extrabold text-3xl ${textPrimary}`}>{selectedContact.name}</h3>
                {selectedContact.company && (
                  <p className="text-lg text-gray-500 flex items-center gap-2 mt-1">
                    <Building className="w-5 h-5" /> {selectedContact.company}
                  </p>
                )}
                {selectedContact.location && (
                  <p className="text-md text-gray-400 flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4" /> {selectedContact.location}
                  </p>
                )}
              </div>
              
              <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                <h4 className={`text-xl font-semibold border-l-4 border-blue-500 pl-3 ${textPrimary}`}>Contact Details</h4>
                
                {selectedContact.email && (
                  <div className={`flex items-center gap-4 p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                      <a href={`mailto:${selectedContact.email}`} className={`text-md font-medium hover:underline ${textPrimary}`}>{selectedContact.email}</a>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-4">PHONE NUMBERS</p>
                  {selectedContact.phoneNumbers.map((phone, index) => (
                    <div key={index} className={`flex items-center justify-between gap-4 p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-4">
                        <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <a href={`tel:${phone.split('(')[0].trim()}`} className={`text-md font-medium hover:underline ${textPrimary}`}>
                          {phone}
                        </a>
                      </div>
                      
                      <button
                        onClick={() => handleDeletePhoneNumberInitiate(selectedContact.id, index)}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                        title="Delete this number"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {error && error.includes('must have at least one phone number') && (
                    <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {error}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD/EDIT CONTACT MODAL */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { isAddModalOpen ? setIsAddModalOpen(false) : setIsEditModalOpen(false); resetFormState(); }}>
          <div 
            className={`rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl ${modalBg}`} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'} ${modalHeaderBg} sticky top-0 z-10`}>
              <h2 className={`text-2xl font-bold ${textPrimary}`}>
                {isEditModalOpen ? 'Edit Contact Details' : 'Add New Contact'}
              </h2>
              <button
                onClick={() => { isAddModalOpen ? setIsAddModalOpen(false) : setIsEditModalOpen(false); resetFormState(); }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && !error.includes('must have at least one phone number') && (
                  <div className="p-3 bg-red-50 border border-red-300 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                      <X className="w-4 h-4 flex-shrink-0" /> {error}
                  </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={contactFormState.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="John Doe"
                    className={getInputClasses(true)}
                  />
                </div>
              </div>

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Numbers <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {contactFormState.phoneNumbers.map((phone, index) => (
                  <div key={index} className="relative flex items-center gap-2">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
                      placeholder={`Phone Number ${index + 1} (e.g., +1 (555) 123-4567)`}
                      className={getInputClasses(true)}
                    />
                    {contactFormState.phoneNumbers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePhoneNumberField(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                        title="Remove phone number field"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddPhoneNumberField}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors font-medium text-sm mt-2"
                >
                  <Plus className="w-4 h-4" /> Add another phone number
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={contactFormState.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                    className={getInputClasses(true)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={contactFormState.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Acme Inc."
                    className={getInputClasses(true)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={contactFormState.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="San Francisco, CA"
                    className={getInputClasses(true)}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { isAddModalOpen ? setIsAddModalOpen(false) : setIsEditModalOpen(false); resetFormState(); }}
                  className={`flex-1 px-4 py-3 border rounded-xl hover:bg-gray-100 transition-all font-medium ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveOrUpdateContact}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex justify-center items-center gap-2"
                >
                  {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> 
                        Saving...
                      </>
                    ) : (
                      isEditModalOpen ? 'Save Changes' : 'Save Contact'
                    )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    
      {/* FULL CONTACT DELETE CONFIRMATION MODAL */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleCancelDelete}>
          <div 
            className={`rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden ${modalBg}`} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-6 flex items-center gap-3 border-b border-gray-100 ${isDark ? 'bg-red-900/50 border-gray-700' : 'bg-red-50'}`}>
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
              <h2 className="text-xl font-bold text-red-700 dark:text-red-300">Confirm Deletion</h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete the contact for 
                <span className="font-semibold text-red-600 dark:text-red-400"> {contactName}</span>? 
                This action cannot be undone and will remove all associated data.
              </p>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-3 border rounded-xl transition-all font-medium disabled:opacity-50 ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteContact}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium disabled:opacity-50 shadow-lg flex justify-center items-center gap-2"
                >
                  {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> 
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" /> Delete Contact
                      </>
                    )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* PHONE NUMBER DELETE CONFIRMATION MODAL */}
      {isPhoneConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleCancelPhoneDelete}>
          <div 
            className={`rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden ${modalBg}`} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-6 flex items-center gap-3 border-b border-gray-100 ${isDark ? 'bg-orange-900/50 border-gray-700' : 'bg-orange-50'}`}>
              <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0" />
              <h2 className="text-xl font-bold text-orange-700 dark:text-orange-300">Confirm Number Deletion</h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete the phone number 
                <span className="font-semibold text-orange-600 dark:text-orange-400"> {phoneToDeleteNumber}</span>? 
              </p>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={handleCancelPhoneDelete}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-3 border rounded-xl transition-all font-medium disabled:opacity-50 ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeletePhoneNumber}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium disabled:opacity-50 shadow-lg flex justify-center items-center gap-2"
                >
                  {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> 
                        Removing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" /> Remove Number
                      </>
                    )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactListApp;
