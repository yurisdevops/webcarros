// Importando as funções necessárias do Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configurações do Firebase para inicializar o aplicativo
const firebaseConfig = {
  apiKey: "AIzaSyB1Qdxe9O1TQi9HcSLYQRX7ta0Rvd9hjdk",
  authDomain: "webcarros-15518.firebaseapp.com",
  projectId: "webcarros-15518",
  storageBucket: "webcarros-15518.appspot.com",
  messagingSenderId: "52417482542",
  appId: "1:52417482542:web:280679d6ff12ff0f9bb4bf",
  measurementId: "G-L1P0028NWG",
};

// Inicializando o aplicativo Firebase com as configurações fornecidas
const app = initializeApp(firebaseConfig);

// Obtendo uma instância do Firestore (banco de dados) associada ao aplicativo
const db = getFirestore(app);

// Obtendo uma instância do Auth (autenticação) associada ao aplicativo
const auth = getAuth(app);

// Obtendo uma instância do Storage (armazenamento de arquivos) associada ao aplicativo
const storage = getStorage(app);

// Exportando as instâncias do Firestore, Auth e Storage para uso em outros arquivos
export { db, auth, storage };
