import DOMPurify from 'dompurify';

interface StorageData {
  [key: string]: any;
}

class SecureStorage {
  private storage: Storage;
  private prefix: string;

  constructor(storage: Storage = sessionStorage, prefix: string = 'app_') {
    this.storage = storage;
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  set(key: string, value: any): void {
    const sanitizedValue = DOMPurify.sanitize(JSON.stringify(value));
    this.storage.setItem(this.getKey(key), sanitizedValue);
  }

  get<T>(key: string): T | null {
    const value = this.storage.getItem(this.getKey(key));
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  remove(key: string): void {
    this.storage.removeItem(this.getKey(key));
  }

  clear(): void {
    Object.keys(this.storage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        this.storage.removeItem(key);
      }
    });
  }
}

export const secureStorage = new SecureStorage();