import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase.js";

const projectsRef = collection(db, "projects");

export async function getProjects() {
  const q = query(projectsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getPublishedProjects() {
  const started = performance.now();

  const q = query(
    projectsRef,
    where("published", "==", true)
  );

  const snapshot = await getDocs(q);

  console.log(
    `Firestore projects loaded in ${Math.round(
      performance.now() - started
    )}ms`
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getPublishedProjectBySlug(slug) {
  const q = query(
    projectsRef,
    where("slug", "==", slug),
    where("published", "==", true)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const projectDoc = snapshot.docs[0];

  return {
    id: projectDoc.id,
    ...projectDoc.data(),
  };
}

export async function createProject(project) {
  const docRef = await addDoc(projectsRef, {
    ...project,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function updateProject(id, project) {
  await updateDoc(doc(db, "projects", id), {
    ...project,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProject(id) {
  await deleteDoc(doc(db, "projects", id));
}