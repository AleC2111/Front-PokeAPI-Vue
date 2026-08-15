# Front-PokeAPI-Vue

Pokemon searcher using Vue and FastAPI

## Project Setup

### Backend (FastAPI)

1. Moverse al directorio `backend`:

```sh
cd backend
```

2. Configurar entorno virtual e instalar dependencias:

```sh
python -m venv venv
source venv/bin/activate  # En Windows usar: venv\Scripts\activate
pip install -r requirements.txt
```

3. (Opcional) Copiar el archivo de variables de entorno de ejemplo:

```sh
cp .env.example .env
```

4. Ejecutar el servidor de backend (se inicia en http://localhost:8000):

```sh
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend (Vue)

1. Instalar las dependencias en la raíz del proyecto:

```sh
npm install
```

2. Compilar e iniciar servidor de desarrollo:

```sh
npm run dev
```

3. Compilar y minificar para producción:

```sh
npm run build
```

4. Ejecutar linter con [ESLint](https://eslint.org/):

```sh
npm run lint
```
