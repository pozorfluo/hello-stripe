# see Stripe CLI reference https://stripe.com/docs/cli

# download Stripe CLI
wget https://github.com/stripe/stripe-cli/releases/download/v1.4.4/stripe_1.4.4_linux_x86_64.tar.gz

# install stripe in bin/
tar -xvf stripe_1.4.4_linux_x86_64.tar.gz -C bin/
rm stripe_1.4.4_linux_x86_64.tar.gz

# login to stripe account
bin/stripe login

# request/watch logs
bin/stripe logs tail

# create customer
bin/stripe customers create

# create a PaymentIntent
bin/stripe payment_intents create --amount=100 --currency=eur

# make raw API requests
bin/stripe post /v1/payment_intents \
    -d amount=2000 \
    -d currency=usd \
    -d "payment_method_types[]=card"

# Integrate in Symfony
# see https://symfonycasts.com/screencast/stripe/stripe-dashboard