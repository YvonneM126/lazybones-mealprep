/* WRITE YOUR JS HERE... YOU MAY REQUIRE MORE THAN ONE JS FILE. IF SO SAVE IT SEPARATELY IN THE SCRIPTS DIRECTORY */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('mealPrepForm');
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const gender = document.getElementById('gender').value;
      const age = parseFloat(document.getElementById('age').value);
      const weight = parseFloat(document.getElementById('weight').value);
      const height = parseFloat(document.getElementById('height').value);
      const meals = parseInt(document.getElementById('meals').value);
      const activityLevel = parseFloat(document.getElementById('activity').value);
      const goal = document.getElementById('goal').value;
      
      // Validate inputs
      if (!gender || isNaN(age) || isNaN(weight) || isNaN(height) || isNaN(meals) || isNaN(activityLevel) || !goal) {
        alert('Please fill all fields with valid values');
        return;
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
      
      // Show results section
      document.getElementById('results').style.display = 'block';
      
      // Scroll to results
      document.getElementById('results').scrollIntoView({
        behavior: 'smooth'
      });
    });
  });