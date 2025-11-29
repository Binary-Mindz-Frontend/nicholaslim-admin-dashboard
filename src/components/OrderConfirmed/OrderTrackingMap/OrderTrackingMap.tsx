const OrderTrackingMap = () => {
  return (
    <section className="">
      {/* Heading */}

      {/* Map */}
      <div className="w-full h-[450px] md:h-[600px] overflow-hidden rounded-lg border border-gray-300 p-6 bg-white">
        <h2 className="text-2xl font-bold  mb-4">
          Live Map Tracking
        </h2>
        <iframe
          title="Our Location"
          width="100%"
          height="100%"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[450px] md:h-[500px]"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24452.41774927038!2d3.564436!3d51.500136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c49c50051dd14b%3A0x581b1e303e3608c3!2sVlissingen%2C%20Netherlands!5e0!3m2!1sen!2sbd!4v1675903922327"
        ></iframe>
      </div>
    </section>
  );
};

export default OrderTrackingMap;
