package group12.Backend.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class seatsOperations {
    public static HashMap<String, Object> decode(Object seatsSold){
        HashMap<String, Object> response = new HashMap<>();
        Map<String, Object> seatsSoldMap = (Map<String, Object>) seatsSold;

        boolean isFastFerry = seatsSoldMap.get("shipType").equals("Fast Ferry");

        int maxUpperPromo = (isFastFerry ? 40 : 20 ) ;
        int maxUpperEconomy = (isFastFerry ? 40 : 20 );
        int maxUpperBusiness = 20;
        int maxLowerPromo = (isFastFerry ? 60 : 40 );
        int maxLowerEconomy = (isFastFerry ? 60 : 40 );
        int maxLowerBusiness = (isFastFerry ? 30 : 10 );
        int totalPromoTaken = 0;
        int totalEconomyTaken = 0;
        int totalBusinessTaken = 0;

        Long upperDeckPromo = ((Number) seatsSoldMap.get("upperDeckPromo")).longValue();
        Long upperDeckEconomy = ((Number) seatsSoldMap.get("upperDeckEconomy")).longValue();
        Long upperDeckBusiness = ((Number) seatsSoldMap.get("upperDeckBusiness")).longValue();
        Long lowerDeckPromo = ((Number) seatsSoldMap.get("lowerDeckPromo")).longValue();
        Long lowerDeckEconomy = ((Number) seatsSoldMap.get("lowerDeckEconomy")).longValue();
        Long lowerDeckBusiness = ((Number) seatsSoldMap.get("lowerDeckBusiness")).longValue();
        

        List<Boolean> seatsUpperDeckPromo = new ArrayList<>();
        List<Boolean> seatsUpperDeckEconomy = new ArrayList<>();
        List<Boolean> seatsUpperDeckBusiness = new ArrayList<>();
        List<Boolean> seatsLowerDeckPromo = new ArrayList<>();
        List<Boolean> seatsLowerDeckEconomy = new ArrayList<>();
        List<Boolean> seatsLowerDeckBusiness = new ArrayList<>();



        for(int i = 0; i<maxUpperPromo; i++){
            if((upperDeckPromo & 1) == 1){
                seatsUpperDeckPromo.add(true);
                totalPromoTaken++;
            }
            else{
                seatsUpperDeckPromo.add(false);
            }
            upperDeckPromo = upperDeckPromo >> 1;
        }
        for(int i = 0; i<maxUpperEconomy; i++){
            if((upperDeckEconomy & 1) == 1){
                seatsUpperDeckEconomy.add(true);
                totalEconomyTaken++;
            }
            else{
                seatsUpperDeckEconomy.add(false);
            }
            upperDeckEconomy = upperDeckEconomy >> 1;
        }
        for(int i = 0; i<maxUpperBusiness; i++){
            if((upperDeckBusiness & 1) == 1){
                seatsUpperDeckBusiness.add(true);
                totalBusinessTaken++;
            }
            else{
                seatsUpperDeckBusiness.add(false);
            }
            upperDeckBusiness = upperDeckBusiness >> 1;
        }
        for(int i = 0; i<maxLowerPromo; i++){
            if((lowerDeckPromo & 1) == 1){
                seatsLowerDeckPromo.add(true);
                totalPromoTaken++;
            }
            else{
                seatsLowerDeckPromo.add(false);
            }
            lowerDeckPromo = lowerDeckPromo >> 1;
        }
        for(int i = 0; i<maxLowerEconomy; i++){
            if((lowerDeckEconomy & 1) == 1){
                seatsLowerDeckEconomy.add(true);
                totalEconomyTaken++;
            }
            else{
                seatsLowerDeckEconomy.add(false);
            }
            lowerDeckEconomy = lowerDeckEconomy >> 1;
        }
        for(int i = 0; i<maxLowerBusiness; i++){
            if((lowerDeckBusiness & 1) == 1){
                seatsLowerDeckBusiness.add(true);
                totalBusinessTaken++;
            }
            else{
                seatsLowerDeckBusiness.add(false);
            }
            lowerDeckBusiness = lowerDeckBusiness >> 1;
        }

        response.put("id", seatsSoldMap.get("id"));
        response.put("voyageId", seatsSoldMap.get("voyageId"));
        response.put("shipType", seatsSoldMap.get("shipType"));
        response.put("upperDeckPromo", seatsUpperDeckPromo);
        response.put("upperDeckEconomy", seatsUpperDeckEconomy);
        response.put("upperDeckBusiness", seatsUpperDeckBusiness);
        response.put("lowerDeckPromo", seatsLowerDeckPromo);
        response.put("lowerDeckEconomy", seatsLowerDeckEconomy);
        response.put("lowerDeckBusiness", seatsLowerDeckBusiness);
        response.put("totalPromoTaken", totalPromoTaken);
        response.put("totalEconomyTaken", totalEconomyTaken);
        response.put("totalBusinessTaken", totalBusinessTaken);
        response.put("promoAvailable", maxLowerPromo + maxUpperPromo - totalPromoTaken);
        response.put("economyAvailable", maxLowerEconomy + maxUpperEconomy - totalEconomyTaken);
        response.put("businessAvailable", maxLowerBusiness + maxUpperBusiness - totalBusinessTaken);

        return response;
    }
}
