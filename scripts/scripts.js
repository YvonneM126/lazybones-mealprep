/* WRITE YOUR JS HERE... YOU MAY REQUIRE MORE THAN ONE JS FILE. IF SO SAVE IT SEPARATELY IN THE SCRIPTS DIRECTORY */
/* Lazybones Meal Prep - Nutrition Calculator */
document.addEventListener('DOMContentLoaded', function() {
  // 检查并初始化页面所需的组件
  initPageComponents();
});

/**
* 初始化页面组件
*/
function initPageComponents() {
  // 初始化营养计算器表单（如果存在）
  initNutritionCalculator();
  
  // 初始化打印按钮（如果存在）
  initPrintFunctionality();
  
  // 初始化汉堡菜单
  initHamburgerMenu();
}

/**
* 初始化营养计算器
*/
function initNutritionCalculator() {
  const form = document.getElementById('mealPrepForm');
  
  // 只有在表单存在的情况下添加事件监听器
  if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const gender = document.getElementById('gender').value;
        const age = parseFloat(document.getElementById('age').value);
        let weight = parseFloat(document.getElementById('weight').value);
        let height = parseFloat(document.getElementById('height').value);
        const meals = parseInt(document.getElementById('meals').value);
        const activityLevel = parseFloat(document.getElementById('activity').value);
        const goal = document.getElementById('goal').value;
        
        // Validate inputs
        if (!gender || isNaN(age) || isNaN(weight) || isNaN(height) || isNaN(meals) || isNaN(activityLevel) || !goal) {
          alert('Please fill all fields with valid values');
          return;
        }
        
        // Check if we need to convert from imperial to metric for calculations
        const isImperial = document.getElementById('unitImperial').classList.contains('active');
        
        if (isImperial) {
          // Convert pounds to kg for calculations
          weight = weight / 2.20462;
          
          // Convert inches to cm for calculations
          height = height * 2.54;
        }
        
        // Calculate BMR using Mifflin-St Jeor Equation
        let bmr;
        if (gender === 'male') {
          bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
          bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        
        // Calculate TDEE
        const tdee = bmr * activityLevel;
        
        // Adjust calories based on goal
        let calories;
        let proteinPercent, carbsPercent, fatPercent;
        
        if (goal === 'loss') {
          calories = tdee - 500;
          proteinPercent = 40;
          carbsPercent = 30;
          fatPercent = 30;
        } else if (goal === 'maintain') {
          calories = tdee;
          proteinPercent = 30;
          carbsPercent = 40;
          fatPercent = 30;
        } else if (goal === 'gain') {
          calories = tdee + 400;
          proteinPercent = 30;
          carbsPercent = 50;
          fatPercent = 20;
        }
        
        // Calculate macronutrients in grams
        const proteinGrams = Math.round((calories * (proteinPercent/100)) / 4);
        const carbsGrams = Math.round((calories * (carbsPercent/100)) / 4);
        const fatGrams = Math.round((calories * (fatPercent/100)) / 9);
        
        // Calculate per meal breakdown
        const caloriesPerMeal = Math.round(calories / meals);
        const proteinPerMeal = Math.round(proteinGrams / meals);
        const carbsPerMeal = Math.round(carbsGrams / meals);
        const fatPerMeal = Math.round(fatGrams / meals);
        
        // Display results
        document.getElementById('bmrResult').textContent = Math.round(bmr);
        document.getElementById('tdeeResult').textContent = Math.round(tdee);
        document.getElementById('calorieResult').textContent = Math.round(calories);
        
        document.getElementById('proteinResult').textContent = proteinGrams;
        document.getElementById('carbsResult').textContent = carbsGrams;
        document.getElementById('fatResult').textContent = fatGrams;
        
        document.getElementById('proteinPercent').textContent = proteinPercent;
        document.getElementById('carbsPercent').textContent = carbsPercent;
        document.getElementById('fatPercent').textContent = fatPercent;
        
        document.getElementById('mealsPerDay').textContent = meals;
        document.getElementById('caloriesPerMeal').textContent = caloriesPerMeal;
        document.getElementById('proteinPerMeal').textContent = proteinPerMeal;
        document.getElementById('carbsPerMeal').textContent = carbsPerMeal;
        document.getElementById('fatPerMeal').textContent = fatPerMeal;
        
        // Update macro bar visualization
        document.getElementById('proteinBar').style.width = proteinPercent + '%';
        document.getElementById('carbsBar').style.width = carbsPercent + '%';
        document.getElementById('fatBar').style.width = fatPercent + '%';
        
        // Add animation classes
        const proteinBar = document.getElementById('proteinBar');
        const carbsBar = document.getElementById('carbsBar');
        const fatBar = document.getElementById('fatBar');
        
        // Reset animations
        proteinBar.style.animation = 'none';
        carbsBar.style.animation = 'none';
        fatBar.style.animation = 'none';
        
        // Trigger reflow
        void proteinBar.offsetWidth;
        void carbsBar.offsetWidth;
        void fatBar.offsetWidth;
        
        // Re-add animations
        proteinBar.style.animation = '';
        carbsBar.style.animation = '';
        fatBar.style.animation = '';
        
        // Show results section
        document.getElementById('results').style.display = 'block';
        
        // Scroll to results
        document.getElementById('results').scrollIntoView({
          behavior: 'smooth'
        });
      });
  }
}

/**
* 初始化打印功能
*/
function initPrintFunctionality() {
// 使用ID选择器查找打印按钮
const printButton = document.getElementById('printButton');
if (printButton) {
  // 添加事件监听器
  printButton.addEventListener('click', function(e) {
    e.preventDefault();
    printNutritionPlan();
  });
} else {
  console.warn('打印按钮未找到，ID为printButton的元素不存在');
}
}

/**
* 打印营养计划 - 重构版
* 创建一个格式良好的打印版本
*/
function printNutritionPlan() {
try {
  // 1. 创建打印内容容器
  const printContent = createPrintContent();
  
  // 2. 创建并配置打印iframe
  const printFrame = setupPrintFrame(printContent);
  
  // 3. 处理打印操作
  handlePrinting(printFrame);
} catch (error) {
  console.error('打印过程中出错:', error);
  alert('打印功能遇到问题，请稍后再试。');
}
}

/**
* 创建打印内容
* @return {HTMLElement} 包含所有打印内容的DOM元素
*/
function createPrintContent() {
// 创建打印内容容器
const printContent = document.createElement('div');
printContent.classList.add('print-content');

// 添加页眉
printContent.appendChild(createHeader());

// 添加计算结果
printContent.appendChild(createResultsSection());

// 添加食物建议
printContent.appendChild(createFoodSuggestions());

// 添加餐食示例
printContent.appendChild(createMealIdeas());

// 添加页脚
printContent.appendChild(createFooter());

return printContent;
}

/**
* 创建页眉
* @return {HTMLElement} 页眉元素
*/
function createHeader() {
const header = document.createElement('div');
header.classList.add('print-header');
header.innerHTML = `
  <h1 style="text-align: center; margin-bottom: 10px; color: #F57C00;">Lazy Bones Meal Plan</h1>
  <p style="text-align: center; margin-bottom: 30px; color: #666;">Your personalized nutrition plan</p>
`;
return header;
}

/**
* 创建结果部分
* @return {HTMLElement} 结果部分元素
*/
function createResultsSection() {
// 获取并克隆结果区域
const resultsSection = document.getElementById('results');
if (!resultsSection) {
  const errorSection = document.createElement('div');
  errorSection.innerHTML = '<p style="color: red;">No results found. Please calculate your nutrition plan first.</p>';
  return errorSection;
}

const resultsCopy = resultsSection.cloneNode(true);

// 移除不需要打印的元素
const buttonContainer = resultsCopy.querySelector('.text-center');
if (buttonContainer) {
  buttonContainer.remove();
}

return resultsCopy;
}

/**
* 创建食物建议部分
* @return {HTMLElement} 食物建议部分元素
*/
function createFoodSuggestions() {
const foodSuggestions = document.createElement('div');
foodSuggestions.classList.add('print-suggestions');
foodSuggestions.innerHTML = `
  <h3 style="margin-top: 30px; margin-bottom: 15px; color: #333;">Recommended Foods</h3>
  <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 30px;">
    <div style="flex: 1; min-width: 200px;">
      <h4 style="margin-bottom: 10px; color: #FF5722;">Protein Sources</h4>
      <ul style="padding-left: 20px; margin-bottom: 20px;">
        <li>Chicken breast</li>
        <li>Lean beef</li>
        <li>Fish (salmon, tuna)</li>
        <li>Eggs</li>
        <li>Greek yogurt</li>
        <li>Tofu</li>
      </ul>
    </div>
    <div style="flex: 1; min-width: 200px;">
      <h4 style="margin-bottom: 10px; color: #2196F3;">Carbohydrate Sources</h4>
      <ul style="padding-left: 20px; margin-bottom: 20px;">
        <li>Brown rice</li>
        <li>Sweet potatoes</li>
        <li>Quinoa</li>
        <li>Oats</li>
        <li>Whole grain bread</li>
        <li>Fruits (berries, apples)</li>
      </ul>
    </div>
    <div style="flex: 1; min-width: 200px;">
      <h4 style="margin-bottom: 10px; color: #FFEB3B;">Healthy Fats</h4>
      <ul style="padding-left: 20px; margin-bottom: 20px;">
        <li>Avocado</li>
        <li>Olive oil</li>
        <li>Nuts (almonds, walnuts)</li>
        <li>Seeds (chia, flax)</li>
        <li>Fatty fish</li>
        <li>Nut butters</li>
      </ul>
    </div>
  </div>
`;
return foodSuggestions;
}

/**
* 创建餐食示例部分
* @return {HTMLElement} 餐食示例部分元素
*/
function createMealIdeas() {
const mealIdeas = document.createElement('div');
mealIdeas.classList.add('print-meal-ideas');
mealIdeas.innerHTML = `
  <h3 style="margin-top: 20px; margin-bottom: 15px; color: #333;">Sample Meal Ideas</h3>
  <div style="margin-bottom: 30px;">
    <h4 style="margin-bottom: 10px; color: #8BC34A;">Breakfast Options</h4>
    <ul style="padding-left: 20px; margin-bottom: 20px;">
      <li>Greek yogurt with berries and honey</li>
      <li>Protein smoothie with spinach, banana, and protein powder</li>
      <li>Oatmeal with nuts and fruit</li>
      <li>Eggs with whole grain toast and avocado</li>
    </ul>
    
    <h4 style="margin-bottom: 10px; color: #8BC34A;">Lunch Options</h4>
    <ul style="padding-left: 20px; margin-bottom: 20px;">
      <li>Grilled chicken salad with mixed greens</li>
      <li>Tuna wrap with whole grain tortilla</li>
      <li>Quinoa bowl with vegetables and tofu</li>
      <li>Lentil soup with a side salad</li>
    </ul>
    
    <h4 style="margin-bottom: 10px; color: #8BC34A;">Dinner Options</h4>
    <ul style="padding-left: 20px; margin-bottom: 20px;">
      <li>Baked salmon with roasted vegetables</li>
      <li>Lean beef stir-fry with brown rice</li>
      <li>Grilled chicken with sweet potato</li>
      <li>Turkey chili with beans</li>
    </ul>
  </div>
`;
return mealIdeas;
}

/**
* 创建页脚
* @return {HTMLElement} 页脚元素
*/
function createFooter() {
const footer = document.createElement('div');
footer.classList.add('print-footer');
footer.innerHTML = `
  <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #999;">
    Generated by Lazy Bones Meal Prep | www.lazybonesmealprep.com<br>
    This plan is personalized based on your inputs and is for informational purposes only.
  </p>
`;
return footer;
}

/**
* 设置打印框架
* @param {HTMLElement} content - 要打印的内容
* @return {HTMLIFrameElement} 配置好的iframe元素
*/
function setupPrintFrame(content) {
// 创建隐藏的iframe
const printFrame = document.createElement('iframe');
printFrame.style.position = 'absolute';
printFrame.style.width = '0';
printFrame.style.height = '0';
printFrame.style.border = '0';
document.body.appendChild(printFrame);

// 添加打印样式
const printStyles = `
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: white;
      padding: 20px;
    }
    .result-item {
      margin-bottom: 15px;
    }
    .macro-breakdown {
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .stat-bar {
      height: 20px;
      background-color: #f5f5f5;
      border-radius: 10px;
      margin-bottom: 10px;
      overflow: hidden;
    }
    .stat-fill {
      height: 100%;
    }
    .protein-fill {
      background-color: #FF5722;
    }
    .carbs-fill {
      background-color: #2196F3;
    }
    .fats-fill {
      background-color: #FFEB3B;
    }
    @media print {
      a {
        display: none !important;
      }
    }
  </style>
`;

// 写入打印内容
printFrame.contentDocument.open();
printFrame.contentDocument.write(`
  <html>
    <head>
      <title>Lazy Bones Meal Plan</title>
      ${printStyles}
    </head>
    <body>
      ${content.outerHTML}
    </body>
  </html>
`);
printFrame.contentDocument.close();

return printFrame;
}

/**
* 处理打印操作
* @param {HTMLIFrameElement} frame - 包含打印内容的iframe
*/
function handlePrinting(frame) {
// 等待内容加载完成后打印
frame.onload = function() {
  try {
    frame.contentWindow.focus();
    frame.contentWindow.print();
  } catch (error) {
    console.error('打印操作失败:', error);
    alert('无法打印。请确保您的浏览器允许弹出窗口，或尝试使用不同的浏览器。');
  }
  
  // 延迟一段时间后移除iframe，避免内存泄漏
  setTimeout(function() {
    try {
      if (frame && frame.parentNode) {
        document.body.removeChild(frame);
      }
    } catch (removeError) {
      console.warn('移除打印框架时出错:', removeError);
    }
  }, 1000);
};
}

/**
* 初始化汉堡菜单功能
*/
function initHamburgerMenu() {
const hamburgerMenu = document.querySelector('.hamburger-menu');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

if (hamburgerMenu && mobileMenuOverlay) {
  // 点击汉堡图标打开菜单
  hamburgerMenu.addEventListener('click', function() {
    const hamburgerIcon = this.querySelector('.hamburger-icon');
    hamburgerIcon.classList.toggle('open');
    
    if (mobileMenuOverlay.style.display === 'block') {
      closeMenu();
    } else {
      openMenu();
    }
  });
  
  // 点击菜单项关闭菜单
  const menuItems = mobileMenuOverlay.querySelectorAll('a');
  menuItems.forEach(item => {
    item.addEventListener('click', closeMenu);
  });
  
  // 点击ESC键关闭菜单
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenuOverlay.style.display === 'block') {
      closeMenu();
    }
  });
}

/**
 * 打开移动菜单
 */
function openMenu() {
  mobileMenuOverlay.style.display = 'block';
  document.body.style.overflow = 'hidden'; // 防止背景滚动
  
  // 添加过渡动画
  setTimeout(() => {
    mobileMenuOverlay.style.opacity = '1';
  }, 10);
}

/**
 * 关闭移动菜单
 */
function closeMenu() {
  const hamburgerIcon = hamburgerMenu.querySelector('.hamburger-icon');
  hamburgerIcon.classList.remove('open');
  
  mobileMenuOverlay.style.opacity = '0';
  
  // 延迟隐藏以完成过渡
  setTimeout(() => {
    mobileMenuOverlay.style.display = 'none';
    document.body.style.overflow = ''; // 恢复背景滚动
  }, 300);
}
}