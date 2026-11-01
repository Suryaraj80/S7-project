import { FarmerProfile, Scheme, RecommendationResult, MatchReason, RecommendationWeights } from '../types';
import { DEFAULT_WEIGHTS } from '../data/demoData';

export function evaluateSchemeEligibility(
  profile: FarmerProfile,
  scheme: Scheme
): { isEligible: boolean; failedReasons: string[] } {
  const failedReasons: string[] = [];

  // 1. Age condition
  if (profile.age < scheme.minimum_age) {
    failedReasons.push(`Age ${profile.age} is below minimum required age of ${scheme.minimum_age} years`);
  }
  if (profile.age > scheme.maximum_age) {
    failedReasons.push(`Age ${profile.age} exceeds maximum permitted age of ${scheme.maximum_age} years`);
  }

  // 2. State & Location condition
  if (scheme.level === 'State') {
    if (scheme.state && scheme.state.toLowerCase() !== 'all india' && scheme.state.toLowerCase() !== profile.state.toLowerCase()) {
      failedReasons.push(`Scheme is exclusive to ${scheme.state} (your profile state: ${profile.state})`);
    } else if (scheme.district && scheme.district.toLowerCase() !== 'all' && scheme.district.toLowerCase() !== 'all 38 districts') {
      const allowedDistricts = scheme.district.split(',').map(d => d.trim().toLowerCase());
      if (allowedDistricts.length > 0 && !allowedDistricts.some(d => d.includes(profile.district.toLowerCase()) || profile.district.toLowerCase().includes(d))) {
        failedReasons.push(`Scheme is restricted to specific district(s): ${scheme.district}`);
      }
    }
  }

  // 3. Landholding constraints
  if (scheme.land_min > 0 && profile.landholdingSize < scheme.land_min) {
    failedReasons.push(`Requires minimum land of ${scheme.land_min} acres (your land: ${profile.landholdingSize} acres)`);
  }
  if (scheme.land_max > 0 && profile.landholdingSize > scheme.land_max) {
    failedReasons.push(`Maximum permissible land is ${scheme.land_max} acres (your land: ${profile.landholdingSize} acres)`);
  }

  // 4. Income limit
  if (scheme.income_limit > 0 && profile.annualIncome > scheme.income_limit) {
    failedReasons.push(`Annual income ₹${profile.annualIncome.toLocaleString('en-IN')} exceeds scheme cap of ₹${scheme.income_limit.toLocaleString('en-IN')}`);
  }

  // 5. Gender / Women-only condition
  if (scheme.women_only && !profile.isWomanFarmer && profile.gender !== 'Female') {
    failedReasons.push(`Scheme is exclusively reserved for women farmers`);
  }

  // 5b. Organic / Farming Type requirement
  if (
    (scheme.farming_type_requirement === 'Organic Only' || scheme.category === 'Organic & Natural Farming') &&
    profile.farmingType !== 'Organic' &&
    profile.farmingType !== 'Natural' &&
    profile.farmingType !== 'ZBNF'
  ) {
    failedReasons.push(`Requires certified chemical-free, natural or organic farming practice (your status: ${profile.farmingType})`);
  }

  // 6. BPL requirement
  if (scheme.bpl_required && !profile.isBpl) {
    failedReasons.push(`Requires Below Poverty Line (BPL) ration card holder status`);
  }

  // 7. Ownership requirement
  if (scheme.ownership_requirement === 'Owner Only' && profile.ownershipType !== 'Owner') {
    failedReasons.push(`Requires formal land title ownership (your status: ${profile.ownershipType})`);
  }

  // 8. Irrigation requirement
  if (scheme.irrigation_requirement === 'Required' && !profile.irrigationAvailable) {
    failedReasons.push(`Requires an existing assured water or irrigation source (borewell, canal, or drip)`);
  } else if (scheme.irrigation_requirement === 'Rainfed Only' && profile.irrigationAvailable) {
    failedReasons.push(`Exclusive to rainfed and dryland farm plots without assured irrigation`);
  }

  // 9. Crop compatibility (hard filter only if scheme has specific crops and doesn't support 'All')
  if (!scheme.eligible_crops.includes('All')) {
    const normCrops = scheme.eligible_crops.map(c => c.toLowerCase());
    const primary = (profile.cropType || '').toLowerCase();
    const secondary = (profile.secondaryCrop || '').toLowerCase();

    const vegetableAliases = ['vegetables', 'tomato', 'onion', 'brinjal', 'chilli', 'chillies', 'shallots', 'ladies finger', 'okra', 'drumstick', 'moringa', 'carrot', 'potato', 'cabbage', 'cauliflower', 'capsicum', 'beetroot', 'beans', 'gourd'];
    const fruitAliases = ['fruits', 'mango', 'banana', 'guava', 'papaya', 'grapes', 'citrus', 'lemon', 'coconut', 'sapota', 'jackfruit', 'pomegranate'];
    const milletAliases = ['millets', 'ragi', 'kambu', 'bajra', 'jowar', 'sorghum', 'thinai', 'samai', 'varagu', 'kodo', 'foxtail'];
    const paddyAliases = ['paddy', 'rice', 'samba', 'kuruvai', 'thaladi', 'ponni'];

    const checkCropMatch = (crop: string) => {
      if (!crop) return false;
      return normCrops.some(nc => {
        if (crop.includes(nc) || nc.includes(crop)) return true;
        if (nc === 'vegetables' && vegetableAliases.some(v => crop.includes(v))) return true;
        if (vegetableAliases.includes(nc) && crop.includes('vegetable')) return true;
        if (nc === 'fruits' && fruitAliases.some(f => crop.includes(f))) return true;
        if (fruitAliases.includes(nc) && crop.includes('fruit')) return true;
        if (nc === 'millets' && milletAliases.some(m => crop.includes(m))) return true;
        if (milletAliases.includes(nc) && crop.includes('millet')) return true;
        if (nc === 'paddy' && paddyAliases.some(p => crop.includes(p))) return true;
        if (paddyAliases.includes(nc) && (crop.includes('paddy') || crop.includes('rice'))) return true;
        return false;
      });
    };

    const matchesPrimary = checkCropMatch(primary);
    const matchesSecondary = secondary ? checkCropMatch(secondary) : false;

    if (!matchesPrimary && !matchesSecondary) {
      failedReasons.push(`Scheme is intended for crops: ${scheme.eligible_crops.join(', ')} (your crops: ${profile.cropType}${profile.secondaryCrop ? `, ${profile.secondaryCrop}` : ''})`);
    }
  }

  // 10. Social Category requirement
  if (!scheme.farmer_categories.includes('All')) {
    if (!scheme.farmer_categories.includes(profile.farmerCategory)) {
      failedReasons.push(`Restricted to farmer categories: ${scheme.farmer_categories.join(', ')}`);
    }
  }

  return {
    isEligible: failedReasons.length === 0,
    failedReasons
  };
}

export function calculateRecommendationScore(
  profile: FarmerProfile,
  scheme: Scheme,
  weights: RecommendationWeights = DEFAULT_WEIGHTS
): { score: number; reasons: MatchReason[] } {
  const reasons: MatchReason[] = [];
  const totalConfigWeight = 
    weights.location +
    weights.crop +
    weights.landholding +
    weights.income +
    weights.category +
    weights.age +
    weights.irrigation +
    weights.farmingType +
    weights.specialFactors;

  let earnedScore = 0;

  // 1. Location Matching
  let locationMatch = false;
  let locationExplanation = '';
  if (scheme.level === 'Central') {
    locationMatch = true;
    locationExplanation = 'Central scheme applicable pan-India including your state';
  } else if (scheme.state.toLowerCase() === profile.state.toLowerCase()) {
    locationMatch = true;
    locationExplanation = `State scheme specifically designed for ${profile.state} farmers`;
    if (scheme.district && scheme.district.toLowerCase().includes(profile.district.toLowerCase())) {
      locationExplanation += ` (matched district: ${profile.district})`;
    }
  } else {
    locationExplanation = `Geographically targeted for ${scheme.state}`;
  }
  if (locationMatch) earnedScore += weights.location;
  reasons.push({
    criterion: 'Location Fit',
    matched: locationMatch,
    explanation: locationExplanation,
    weightContribution: locationMatch ? weights.location : 0
  });

  // 2. Crop Matching
  let cropMatch = false;
  let cropExplanation = '';
  if (scheme.eligible_crops.includes('All')) {
    cropMatch = true;
    cropExplanation = `Covers all agricultural crops including your ${profile.cropType}`;
  } else {
    const norm = scheme.eligible_crops.map(c => c.toLowerCase());
    const matchesPrimary = norm.some(c => profile.cropType.toLowerCase().includes(c) || c.includes(profile.cropType.toLowerCase()));
    const matchesSecondary = profile.secondaryCrop && norm.some(c => profile.secondaryCrop.toLowerCase().includes(c) || c.includes(profile.secondaryCrop.toLowerCase()));
    if (matchesPrimary || matchesSecondary) {
      cropMatch = true;
      cropExplanation = `Specifically benefits your crop (${matchesPrimary ? profile.cropType : profile.secondaryCrop})`;
    } else {
      cropExplanation = `Not primary focus for ${profile.cropType} (targets: ${scheme.eligible_crops.slice(0, 3).join(', ')})`;
    }
  }
  if (cropMatch) earnedScore += weights.crop;
  reasons.push({
    criterion: 'Crop Alignment',
    matched: cropMatch,
    explanation: cropExplanation,
    weightContribution: cropMatch ? weights.crop : 0
  });

  // 3. Landholding Matching
  let landMatch = false;
  let landExplanation = '';
  const withinMin = scheme.land_min === 0 || profile.landholdingSize >= scheme.land_min;
  const withinMax = scheme.land_max === 0 || profile.landholdingSize <= scheme.land_max;
  if (withinMin && withinMax) {
    landMatch = true;
    if (scheme.land_max > 0) {
      landExplanation = `Landholding (${profile.landholdingSize} acres) fits targeted range (${scheme.land_min || 0} - ${scheme.land_max} acres)`;
    } else {
      landExplanation = `Eligible for your ${profile.landholdingSize} acres landholding`;
    }
  } else {
    landExplanation = `Landholding outside priority bracket`;
  }
  if (landMatch) earnedScore += weights.landholding;
  reasons.push({
    criterion: 'Landholding Scale',
    matched: landMatch,
    explanation: landExplanation,
    weightContribution: landMatch ? weights.landholding : 0
  });

  // 4. Financial & Income Matching
  let incomeMatch = false;
  let incomeExplanation = '';
  if (scheme.income_limit === 0) {
    incomeMatch = true;
    incomeExplanation = 'No restrictive income barrier; open for welfare support';
  } else if (profile.annualIncome <= scheme.income_limit) {
    incomeMatch = true;
    incomeExplanation = `Income of ₹${profile.annualIncome.toLocaleString('en-IN')} is within ceiling (₹${scheme.income_limit.toLocaleString('en-IN')})`;
  } else {
    incomeExplanation = 'Income exceeds designated priority threshold';
  }
  if (incomeMatch) earnedScore += weights.income;
  reasons.push({
    criterion: 'Income Suitability',
    matched: incomeMatch,
    explanation: incomeExplanation,
    weightContribution: incomeMatch ? weights.income : 0
  });

  // 5. Farmer Social Category & Target Class
  let categoryMatch = false;
  let categoryExplanation = '';
  if (scheme.farmer_categories.includes('All')) {
    categoryMatch = true;
    categoryExplanation = `Open to all categories (${profile.farmerCategory} recognized)`;
  } else if (scheme.farmer_categories.includes(profile.farmerCategory)) {
    categoryMatch = true;
    categoryExplanation = `Direct priority for ${profile.farmerCategory} farming community`;
  } else {
    categoryExplanation = `Targeted towards ${scheme.farmer_categories.join('/')}`;
  }
  if (categoryMatch) earnedScore += weights.category;
  reasons.push({
    criterion: 'Farmer Category',
    matched: categoryMatch,
    explanation: categoryExplanation,
    weightContribution: categoryMatch ? weights.category : 0
  });

  // 6. Age Criteria
  let ageMatch = false;
  let ageExplanation = '';
  if (profile.age >= scheme.minimum_age && profile.age <= scheme.maximum_age) {
    ageMatch = true;
    ageExplanation = `Age ${profile.age} years satisfies age bracket (${scheme.minimum_age}-${scheme.maximum_age} yrs)`;
  } else {
    ageExplanation = `Age outside operational bracket`;
  }
  if (ageMatch) earnedScore += weights.age;
  reasons.push({
    criterion: 'Age Compliance',
    matched: ageMatch,
    explanation: ageExplanation,
    weightContribution: ageMatch ? weights.age : 0
  });

  // 7. Irrigation Fit
  let irrigationMatch = false;
  let irrigationExplanation = '';
  if (scheme.irrigation_requirement === 'Any') {
    irrigationMatch = true;
    irrigationExplanation = 'Applicable for both irrigated and rainfed holdings';
  } else if (scheme.irrigation_requirement === 'Required' && profile.irrigationAvailable) {
    irrigationMatch = true;
    irrigationExplanation = `Matches your existing ${profile.irrigationType} water source`;
  } else if (scheme.irrigation_requirement === 'Micro-Irrigation Willing') {
    irrigationMatch = true;
    irrigationExplanation = 'Ideal for installing drip / sprinkler water conservation';
  } else {
    irrigationExplanation = 'Water infrastructure prerequisites not fully aligned';
  }
  if (irrigationMatch) earnedScore += weights.irrigation;
  reasons.push({
    criterion: 'Irrigation Suitability',
    matched: irrigationMatch,
    explanation: irrigationExplanation,
    weightContribution: irrigationMatch ? weights.irrigation : 0
  });

  // 8. Farming Type Compatibility (Organic vs Conventional)
  let farmingMatch = false;
  let farmingExplanation = '';
  if (scheme.category === 'Organic & Natural Farming') {
    if (profile.farmingType === 'Organic' || profile.farmingType === 'Natural' || profile.farmingType === 'ZBNF') {
      farmingMatch = true;
      farmingExplanation = `Direct high-value match for your ${profile.farmingType} cultivation method`;
    } else {
      farmingExplanation = 'Scheme promotes organic conversion for conventional growers';
    }
  } else {
    farmingMatch = true;
    farmingExplanation = `Supports ${profile.farmingType} farm operations`;
  }
  if (farmingMatch) earnedScore += weights.farmingType;
  reasons.push({
    criterion: 'Farming Practice',
    matched: farmingMatch,
    explanation: farmingExplanation,
    weightContribution: farmingMatch ? weights.farmingType : 0
  });

  // 9. Special Attributes (Women farmer, small/marginal, livestock, BPL)
  let specialMatch = false;
  let specialExplanation = '';
  if (scheme.women_only && (profile.isWomanFarmer || profile.gender === 'Female')) {
    specialMatch = true;
    specialExplanation = 'Special women farmer empowerment priority';
  } else if (scheme.category === 'Livestock & Dairy' && profile.hasLivestock) {
    specialMatch = true;
    specialExplanation = `Empowers your livestock assets (${profile.livestockTypes.join(', ') || 'dairy'})`;
  } else if (profile.smallMarginalClassification === 'Marginal' || profile.smallMarginalClassification === 'Small') {
    specialMatch = true;
    specialExplanation = `Special priority for ${profile.smallMarginalClassification} landholders`;
  } else {
    specialMatch = true;
    specialExplanation = 'Standard eligibility credentials satisfied';
  }
  if (specialMatch) earnedScore += weights.specialFactors;
  reasons.push({
    criterion: 'Special Provisions',
    matched: specialMatch,
    explanation: specialExplanation,
    weightContribution: specialMatch ? weights.specialFactors : 0
  });

  const normalizedScore = Math.min(100, Math.round((earnedScore / totalConfigWeight) * 100));

  return {
    score: normalizedScore,
    reasons
  };
}

export function generateRecommendations(
  profile: FarmerProfile,
  allSchemes: Scheme[],
  weights: RecommendationWeights = DEFAULT_WEIGHTS
): RecommendationResult[] {
  const results: RecommendationResult[] = [];

  for (const scheme of allSchemes) {
    if (scheme.status !== 'active') continue;

    // Stage 1: Eligibility check
    const { isEligible, failedReasons } = evaluateSchemeEligibility(profile, scheme);

    // Stage 2: Scoring
    const { score, reasons } = calculateRecommendationScore(profile, scheme, weights);

    // Assign relevance badge
    let badge: 'Highly Relevant' | 'Recommended' | 'Informative' = 'Informative';
    if (isEligible) {
      if (score >= 80) badge = 'Highly Relevant';
      else if (score >= 50) badge = 'Recommended';
    }

    results.push({
      scheme,
      matchScore: score,
      isEligible,
      reasons,
      unmatchedCriteria: failedReasons,
      recommendedBadge: badge
    });
  }

  // Sort by: Eligible first, then descending by match score
  results.sort((a, b) => {
    if (a.isEligible && !b.isEligible) return -1;
    if (!a.isEligible && b.isEligible) return 1;
    return b.matchScore - a.matchScore;
  });

  return results;
}

export function simulateWhatIf(
  baseProfile: FarmerProfile,
  overrides: Partial<FarmerProfile>,
  allSchemes: Scheme[],
  weights: RecommendationWeights = DEFAULT_WEIGHTS
): {
  simulatedResults: RecommendationResult[];
  unlockedSchemes: Scheme[];
  lostSchemes: Scheme[];
  scoreDiff: number;
} {
  const simulatedProfile = { ...baseProfile, ...overrides };
  const baseResults = generateRecommendations(baseProfile, allSchemes, weights);
  const simulatedResults = generateRecommendations(simulatedProfile, allSchemes, weights);

  const baseEligibleIds = new Set(baseResults.filter(r => r.isEligible).map(r => r.scheme.id));
  const simEligibleIds = new Set(simulatedResults.filter(r => r.isEligible).map(r => r.scheme.id));

  const unlockedSchemes = simulatedResults
    .filter(r => r.isEligible && !baseEligibleIds.has(r.scheme.id))
    .map(r => r.scheme);

  const lostSchemes = baseResults
    .filter(r => r.isEligible && !simEligibleIds.has(r.scheme.id))
    .map(r => r.scheme);

  const baseAvgScore = baseResults.reduce((acc, r) => acc + r.matchScore, 0) / (baseResults.length || 1);
  const simAvgScore = simulatedResults.reduce((acc, r) => acc + r.matchScore, 0) / (simulatedResults.length || 1);

  return {
    simulatedResults,
    unlockedSchemes,
    lostSchemes,
    scoreDiff: Math.round(simAvgScore - baseAvgScore)
  };
}
