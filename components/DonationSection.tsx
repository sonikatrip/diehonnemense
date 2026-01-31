import Image from 'next/image';

export default function DonationSection() {
  return (
    <section className="donations-section" id="donations">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Support Our Mission</h2>
          <p className="section-subtitle">Every contribution helps us save more lives</p>
        </div>
        <div className="donation-content">
          <div className="donation-info">
            <div className="donation-card current-drive">
              <span className="drive-badge">Current Drive</span>
              <h3>Winter Warmth Campaign</h3>
              <p>Help us provide blankets, shelter materials, and warm bedding for animals during the cold Western Cape winter months.</p>
              <div className="drive-needs">
                <h4>Urgent Needs:</h4>
                <ul>
                  <li>Blankets and towels</li>
                  <li>Dog houses/shelters</li>
                  <li>Waterproof covers</li>
                  <li>Straw for bedding</li>
                </ul>
              </div>
            </div>
            <div className="donation-card">
              <h3>Medical Fund</h3>
              <p>Veterinary care is our biggest expense. From vaccinations to emergency surgeries, your donations save lives.</p>
              <div className="drive-needs">
                <h4>Covers:</h4>
                <ul>
                  <li>Emergency vet visits</li>
                  <li>Surgeries &amp; treatments</li>
                  <li>Medications</li>
                  <li>Sterilizations</li>
                </ul>
              </div>
            </div>
            <div className="donation-card">
              <h3>Food &amp; Supplies</h3>
              <p>With many mouths to feed, quality nutrition is essential for the health and recovery of our rescues.</p>
              <div className="drive-needs">
                <h4>Always Needed:</h4>
                <ul>
                  <li>Premium dog &amp; cat food</li>
                  <li>Puppy/kitten formula</li>
                  <li>Treats for training</li>
                  <li>Collars, leashes, bowls</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="donation-bank">
            <h3>Make a Donation</h3>
            <p>Your financial support enables us to rescue more animals and provide them with the care they deserve.</p>
            <div className="bank-details-wrapper">
              <Image src="/images/logo/donation-bank-account.png" alt="Diehonnemense Bank Account Details" className="bank-details-image" width={400} height={200} />
            </div>
            <div className="other-ways">
              <h4>Other Ways to Help</h4>
              <ul>
                <li><strong>Volunteer:</strong> Help with feeding, walking, and socializing animals</li>
                <li><strong>Foster:</strong> Provide temporary homes for animals awaiting adoption</li>
                <li><strong>Donate Supplies:</strong> Drop off food, blankets, and other essentials</li>
                <li><strong>Spread the Word:</strong> Share our posts and help animals find homes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
