# Windows install fix

If npm tries to download from `packages.applied-caas-gateway1.internal.api.openai.org`, delete the old lock file and force npm to use the public registry.

Run these commands inside the project folder:

```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm config set registry https://registry.npmjs.org/
npm cache clean --force
npm install
npm run dev
```

Then open http://localhost:5173
