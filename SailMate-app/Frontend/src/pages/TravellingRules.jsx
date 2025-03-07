import React from 'react';

const TravellingRules = () => {
  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-[#0D3A73] mb-8 text-center">
          Travelling Rules
        </h2>
        <div className="space-y-6 text-gray-700">
          <div>
            <h3 className="text-xl font-semibold text-[#0D3A73] mb-2">
              1. Boarding and Check-In
            </h3>
            <ul className="list-disc list-inside">
              <li>Arrive at the terminal at least <strong>45 minutes before departure</strong> for foot passengers and <strong>90 minutes</strong> for passengers with vehicles.</li>
              <li>Have your ticket (printed or digital) and valid identification ready for inspection at check-in.</li>
              <li>Follow instructions from staff during boarding and disembarking.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#0D3A73] mb-2">
              2. Safety On Board
            </h3>
            <ul className="list-disc list-inside">
              <li>Always follow the safety instructions provided by the crew, including the location of life jackets and emergency exits.</li>
              <li>Remain seated while the ferry is in motion, especially during rough sea conditions.</li>
              <li>Keep aisles and emergency exits clear at all times.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#0D3A73] mb-2">
              3. Prohibited Items
            </h3>
            <ul className="list-disc list-inside">
              <li>For safety reasons, the following items are <strong>not allowed</strong> on board:</li>
              <ul className="list-circle list-inside pl-5">
                <li>Flammable or explosive materials (e.g., fireworks, gasoline).</li>
                <li>Weapons or sharp objects (e.g., knives, scissors).</li>
                <li>Illegal substances or drugs.</li>
                <li>Excessive amounts of alcohol (personal consumption within reasonable limits is permitted).</li>
              </ul>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#0D3A73] mb-2">
              4. Behavior and Conduct
            </h3>
            <ul className="list-disc list-inside">
              <li>Be respectful of other passengers and crew members.</li>
              <li>Smoking is strictly prohibited in all indoor areas. Designated smoking zones are available on deck.</li>
              <li>Loud music or disruptive behavior is not allowed.</li>
              <li>Parents or guardians are responsible for supervising children at all times.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#0D3A73] mb-2">
              5. Luggage and Personal Belongings
            </h3>
            <ul className="list-disc list-inside">
              <li>Each passenger is allowed <strong>one carry-on bag</strong> and <strong>one checked luggage</strong> (size and weight limits apply).</li>
              <li>Keep your belongings with you at all times. Unattended items may be removed for security reasons.</li>
              <li>Valuable items should not be left unattended. SailMate is not responsible for lost or stolen items.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#0D3A73] mb-2">
              6. Pets and Animals
            </h3>
            <ul className="list-disc list-inside">
              <li>Pets are allowed on board but must be kept on a leash or in a carrier at all times.</li>
              <li>Owners are responsible for cleaning up after their pets.</li>
              <li>Ensure your pet does not disturb other passengers.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#0D3A73] mb-2">
              7. Environmental Responsibility
            </h3>
            <ul className="list-disc list-inside">
              <li>Dispose of trash in the designated bins.</li>
              <li>Avoid littering or throwing anything overboard.</li>
              <li>Help us protect the marine environment by minimizing waste and recycling where possible.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#0D3A73] mb-2">
              8. Health and Hygiene
            </h3>
            <ul className="list-disc list-inside">
              <li>If you feel unwell during the journey, inform a crew member immediately.</li>
              <li>Use hand sanitizers and wash your hands regularly, especially before eating.</li>
              <li>Cover your mouth and nose when coughing or sneezing.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#0D3A73] mb-2">
              9. Delays and Cancellations
            </h3>
            <ul className="list-disc list-inside">
              <li>In case of delays or cancellations due to weather or technical issues, follow the instructions provided by the crew or terminal staff.</li>
              <li>Stay updated through announcements, the SailMate website, or customer service.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#0D3A73] mb-2">
              10. Compliance with Local Laws
            </h3>
            <ul className="list-disc list-inside">
              <li>Passengers must comply with all local laws and regulations at departure and arrival points.</li>
              <li>Customs and immigration requirements are the responsibility of the passenger.</li>
            </ul>
          </div>

          <p className="mt-8 text-center text-gray-600">
            By following these rules, you contribute to a safe, enjoyable, and smooth journey for everyone. Thank you for choosing SailMate!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TravellingRules;