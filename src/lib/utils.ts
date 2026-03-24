import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export const serializeNonPOJOs = <T>(obj: T): T => {
  return structuredClone(obj);
};

interface PbUser {
  id: string;
  collectionId: string;
  [key: string]: any;
  avatar?: string;
  name?: string;
}

interface PbRecord {
  id: string;
  collectionId: string;
  [key: string]: any;
}

// generic helper for any file in pocketbase
export function getPbUrl(record: PbRecord | undefined, fileName: string | undefined) {
  if (!record || !fileName) return '';

  const collectionId = record.collectionId || record['@collectionId'];

  return `${PUBLIC_POCKETBASE_URL}/api/files/${collectionId}/${record.id}/${fileName}`;
}

export function getAvatarUrl(user: PbUser | undefined) {
  if (!user?.avatar) return '';
  return `${PUBLIC_POCKETBASE_URL}/api/files/${user.collectionId}/${user.id}/${user.avatar}`;
}

export function getFallback(name: string | undefined) {
  return name?.charAt(0).toUpperCase() ?? "U";
}
