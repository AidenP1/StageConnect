<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UsersSeeder::class,
            StagesSeeder::class,
            CandidaturesSeeder::class,
            RatingsSeeder::class,
        ]);
    }
}
