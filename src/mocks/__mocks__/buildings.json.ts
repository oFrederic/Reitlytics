/**
 * Mock for buildings.json data used in tests
 */

const mockBuildingsData = {
  data: {
    jReitBuildings: [
      {
        id: 'test-id-1',
        buildingSpec: {
          name: 'Test Building 1',
          address: 'Tokyo, Japan'
        },
        assetType: {
          isOffice: true,
          isRetail: false,
          isHotel: false,
          isParking: false,
          isIndustrial: false,
          isLogistic: false,
          isResidential: false,
          isHealthCare: false,
          isOther: false
        },
        yieldEvaluation: {
          capRate: '4.5',
          appraisedPrice: 10000000
        }
      },
      {
        id: 'test-id-2',
        buildingSpec: {
          name: 'Test Building 2',
          address: 'Osaka, Japan'
        },
        assetType: {
          isOffice: false,
          isRetail: true,
          isHotel: false,
          isParking: false,
          isIndustrial: false,
          isLogistic: false,
          isResidential: false,
          isHealthCare: false,
          isOther: false
        },
        yieldEvaluation: {
          capRate: '5.2',
          appraisedPrice: 15000000
        }
      },
      {
        id: 'test-id-3',
        buildingSpec: {
          name: 'Shibuya Mall',
          address: 'Shibuya, Tokyo, Japan'
        },
        assetType: {
          isOffice: false,
          isRetail: false,
          isHotel: true,
          isParking: false,
          isIndustrial: false,
          isLogistic: false,
          isResidential: false,
          isHealthCare: false,
          isOther: false
        },
        yieldEvaluation: {
          capRate: '3.8',
          appraisedPrice: 8000000
        }
      }
    ]
  }
};

export default mockBuildingsData; 