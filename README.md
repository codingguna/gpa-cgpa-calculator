# 🎓 GPA / CGPA Calculator App  
A modern, theme-enabled GPA & CGPA calculator built using **React Native**, **Expo**, and **AsyncStorage**.

---

📥 **Download Latest APK**  
👉 [**Go to Releases**](../../releases/latest) to download the newest version of the app.

---

# 📱 Screenshots

> Replace the image URLs with your own screenshots.

### 🔵 **Home Page (Light Mode)**
<img src="https://via.placeholder.com/400x800?text=Home+Light" width="300" />

### ⚫ **Home Page (Dark Mode)**
<img src="https://via.placeholder.com/400x800?text=Home+Dark" width="300" />

---

### 📘 **GPA Calculator – Input Screen**
<img src="https://via.placeholder.com/400x800?text=GPA+Page" width="300" />

### 📘 **GPA Calculator – History**
<img src="https://via.placeholder.com/400x800?text=GPA+History" width="300" />

---

### 📙 **OGPA Calculator – Select Semesters**
<img src="https://via.placeholder.com/400x800?text=OGPA+Select" width="300" />

### 📙 **OGPA Details Expanded**
<img src="https://via.placeholder.com/400x800?text=OGPA+Details" width="300" />

---

## 🛠️ Tech Stack & Tools

| Tech | Badge |
|------|--------|
| React Native | ![React Native](https://img.shields.io/badge/React%20Native-20232A?logo=react&logoColor=61DAFB) |
| Expo | ![Expo](https://img.shields.io/badge/Expo-000?logo=expo&logoColor=fff) |
| JavaScript | ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) |
| AsyncStorage | ![Storage](https://img.shields.io/badge/AsyncStorage-4B5563?logo=icloud&logoColor=white) |
| Expo Router | ![Expo Router](https://img.shields.io/badge/Expo%20Router-black?logo=react&logoColor=white) |

---

## 📖 About the Project

A mobile app that calculates **GPA** for each semester and **OGPA/CGPA** by combining multiple semesters.  
Includes dark/light themes, smooth animations, and automatic history management.

---

## ✨ Features

### 📚 GPA Calculator
- Add unlimited subjects  
- Auto validation  
- Auto-save to history  
- Edit & delete records  

### 🎓 OGPA / CGPA Calculator
- Combine multiple GPA records  
- Expand to view semester-wise details  
- Save & edit OGPA calculations  

### 🎨 UI Features
- Beautiful Neumorphic design  
- Responsive layout  
- Smooth animations  
- Light/Dark theme toggle with persistence  

---

## 📁 Project Structure

```
project-root/
│
├── app/
│   ├── index.js              # Home screen
│   ├── gpa.js                # GPA Calculator
│   ├── ogpa.js               # OGPA Calculator
│   └── _layout.js            # Expo Router layout
│
├── components/
│   ├── ThemeContext.js       # Theme Provider & persistence
│   ├── theme.js              # Light/Dark theme definitions
│   └── ThemeToggle.js        # Theme switch button
│
├── assets/                   # Images, splash screens, icons
├── app.json                  # Expo app configuration
├── eas.json                  # EAS build configuration
├── package.json
└── README.md
```

---

## 🔄 App Workflow

### **1️⃣ GPA Workflow**
- Enter semester name  
- Add subjects (code, credits, grade points)  
- Press **Calculate GPA**  
- Entry is saved automatically  
- History allows edit, delete, or clear all  

---

### **2️⃣ OGPA Workflow**
- Go to OGPA page  
- Select multiple saved GPA records  
- Enter OGPA name  
- Press **Calculate OGPA**  
- OGPA saved with expandable details  
- Edit or delete OGPA anytime  

---

### **3️⃣ Theme System**
- Tap the **theme icon** (top-right)  
- Switch between **Light** / **Dark** mode  
- Theme preference is saved using **AsyncStorage**  

---

## 🚀 Installation

### **Prerequisites**

✔ Node.js  
✔ Yarn or npm  
✔ Expo CLI installed globally  

```bash
npm install -g expo-cli
```

### Clone the project
```bash
git clone https://github.com/yourname/gpa-cgpa-calculator.git
cd gpa-cgpa-calculator
```

### Install dependencies
```bash
yarn install
# or
npm install
```

### Start the app
```bash
npx expo start
```

### Run on a device/emulator
```bash
npx expo run:android
npx expo run:ios
```

---

## 📲 How to Use

### ✔ Calculate GPA
1. Open **GPA** page  
2. Enter semester name  
3. Enter subjects code, credit hour & grade point   
4. Tap **Calculate GPA**  
5. Check saved GPA records below  

### ✔ Calculate OGPA
1. Open **OGPA** page  
2. Select already saved GPA records or enter new GPA records in **GPA** page 
3. Enter OGPA name  
4. Tap **Calculate OGPA**  

### ✔ Switch Theme
- Tap the **sun/moon** icon  
- Theme changes instantly  

---

## 🧾 Conclusion

This application provides a clean, fast, and offline-capable solution to calculate academic performance.  
Built using modern **Expo + React Native**, it ensures:

- Smooth UI  
- Accurate GPA/OGPA calculations  
- Persistent local storage  
- Beautiful light/dark themes  

---

🎉 **Feel free to contribute or open issues to improve the app!**
