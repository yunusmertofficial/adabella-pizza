export interface Address {
  id: number;
  title: string;
  fullAddress: string;
  coordinates: { lat: number; lng: number };
  isSelected: boolean;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  workingHours: string;
  distance?: number;
  isOpen: boolean;
}

export interface AddressSuggestion {
  id: string;
  text: string;
  latitude?: number;
  longitude?: number;
}
