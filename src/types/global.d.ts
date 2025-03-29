interface DaumPostcodeData {
  address: string;
  addressType: string;
  buildingName: string;
  apartment: string;
  jibunAddress: string;
  roadAddress: string;
  zonecode: string;
  autoJibunAddress?: string;
  [key: string]: any;
}

interface DaumPostcode {
  embed(element: HTMLElement): void;
  open(): void;
}

interface DaumNamespace {
  Postcode: {
    new (options: {
      width?: string;
      height?: string;
      oncomplete: (data: DaumPostcodeData) => void;
    }): DaumPostcode;
  };
}

interface Window {
  daum: DaumNamespace;
}
