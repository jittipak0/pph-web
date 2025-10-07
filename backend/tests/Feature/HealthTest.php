<?php

declare(strict_types=1);

it('boots the framework', function () {
    $response = $this->get('/'); // default welcome route
    $response->assertStatus(200);
});
